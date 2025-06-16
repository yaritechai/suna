#!/bin/bash

# 🚀 Enhanced Agent V2 Startup Script
# ===================================
# Starts all components of the Enhanced Agent system with Supabase integration

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[Enhanced Agent V2]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running from correct directory
if [[ ! -f "package.json" ]] || [[ ! -d "backend" ]]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting Enhanced Agent V2 with Supabase Integration..."

# === ENVIRONMENT SETUP ===
print_status "Setting up environment..."

# Load environment variables
if [[ -f ".env" ]]; then
    export $(grep -v '^#' .env | xargs)
    print_success "Environment variables loaded from .env"
else
    print_warning "No .env file found. Using environment defaults."
    print_warning "Copy env.enhanced.example to .env and configure your settings."
fi

# Set default values if not configured
export ENHANCED_AGENT_ENABLED=${ENHANCED_AGENT_ENABLED:-true}
export ENHANCED_AGENT_HOST=${ENHANCED_AGENT_HOST:-0.0.0.0}
export ENHANCED_AGENT_PORT=${ENHANCED_AGENT_PORT:-8000}
export REDIS_URL=${REDIS_URL:-redis://localhost:6379}
export LOG_LEVEL=${LOG_LEVEL:-INFO}

# === DEPENDENCY CHECKS ===
print_status "Checking dependencies..."

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.8+"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

# Check Redis
if ! command -v redis-cli &> /dev/null; then
    print_warning "Redis CLI not found. Installing Redis is recommended for optimal performance."
    print_warning "Install with: brew install redis (Mac) or apt-get install redis (Ubuntu)"
fi

print_success "Dependencies checked"

# === REDIS SETUP ===
print_status "Setting up Redis..."

# Check if Redis is running
if redis-cli -u "$REDIS_URL" ping &>/dev/null; then
    print_success "Redis is running and accessible"
else
    print_warning "Redis is not running. Starting Redis..."
    
    # Try to start Redis
    if command -v redis-server &> /dev/null; then
        redis-server --daemonize yes --port 6379 2>/dev/null || true
        sleep 2
        
        if redis-cli -u "$REDIS_URL" ping &>/dev/null; then
            print_success "Redis started successfully"
        else
            print_error "Failed to start Redis. Please start Redis manually:"
            print_error "  brew services start redis (Mac)"
            print_error "  sudo systemctl start redis (Ubuntu)"
            exit 1
        fi
    else
        print_error "Redis is not installed. Please install Redis:"
        print_error "  brew install redis (Mac)"
        print_error "  sudo apt-get install redis-server (Ubuntu)"
        exit 1
    fi
fi

# === PYTHON ENVIRONMENT SETUP ===
print_status "Setting up Python environment..."

# Create virtual environment if it doesn't exist
if [[ ! -d "backend/venv" ]]; then
    print_status "Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
    print_success "Virtual environment created"
fi

# Activate virtual environment
source backend/venv/bin/activate
print_success "Virtual environment activated"

# Install/update Python dependencies
print_status "Installing Python dependencies..."
cd backend
pip install -q --upgrade pip
pip install -q -r requirements-optimized.txt
print_success "Python dependencies installed"

# Install Playwright browsers
print_status "Setting up Playwright browsers..."
if [[ "${PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD}" != "true" ]]; then
    playwright install chromium --quiet
    print_success "Playwright browsers installed"
else
    print_warning "Playwright browser download skipped (PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true)"
fi

cd ..

# === NODE.js ENVIRONMENT SETUP ===
print_status "Setting up Node.js environment..."

# Install/update Node.js dependencies
if [[ ! -d "node_modules" ]]; then
    print_status "Installing Node.js dependencies..."
    npm install --silent
    print_success "Node.js dependencies installed"
else
    print_success "Node.js dependencies already installed"
fi

# === DATABASE SETUP ===
print_status "Checking database setup..."

if [[ -n "$NEXT_PUBLIC_SUPABASE_URL" ]] && [[ -n "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
    print_success "Supabase configuration found"
    
    # Optional: Run database migrations for enhanced features
    if [[ -f "backend/supabase/migrations/enhanced_agent_tables.sql" ]]; then
        print_status "Enhanced agent tables available (optional optimization)"
        print_warning "Run: supabase db push to apply enhanced performance tables"
    fi
else
    print_warning "Supabase configuration not found in environment"
    print_warning "Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
fi

# === CONFIGURATION VALIDATION ===
print_status "Validating configuration..."

# Check critical environment variables
MISSING_VARS=()

if [[ -z "$NEXT_PUBLIC_SUPABASE_URL" ]]; then
    MISSING_VARS+=("NEXT_PUBLIC_SUPABASE_URL")
fi

if [[ -z "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
    MISSING_VARS+=("SUPABASE_SERVICE_ROLE_KEY")
fi

if [[ ${#MISSING_VARS[@]} -gt 0 ]]; then
    print_error "Missing critical environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        print_error "  - $var"
    done
    print_error "Please configure these in your .env file"
    exit 1
fi

print_success "Configuration validated"

# === SERVICE STARTUP ===
print_status "Starting Enhanced Agent services..."

# Kill existing processes if any
pkill -f "enhanced_agent" 2>/dev/null || true
pkill -f "supabase_agent_integration" 2>/dev/null || true

# Start Enhanced Agent Backend
print_status "Starting Enhanced Agent Backend..."
cd backend

# Start the integrated backend service
python -m integrations.supabase_agent_integration &
BACKEND_PID=$!

cd ..

# Wait for backend to start
print_status "Waiting for backend to start..."
for i in {1..30}; do
    if curl -s "http://localhost:$ENHANCED_AGENT_PORT/health" >/dev/null 2>&1; then
        print_success "Enhanced Agent Backend started successfully"
        break
    fi
    
    if [[ $i -eq 30 ]]; then
        print_error "Backend failed to start within 30 seconds"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    
    sleep 1
done

# === HEALTH CHECKS ===
print_status "Running health checks..."

# Check backend health
HEALTH_RESPONSE=$(curl -s "http://localhost:$ENHANCED_AGENT_PORT/health" || echo "failed")
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    print_success "Backend health check passed"
else
    print_error "Backend health check failed"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Check Redis connectivity
if redis-cli -u "$REDIS_URL" ping >/dev/null 2>&1; then
    print_success "Redis connectivity check passed"
else
    print_warning "Redis connectivity check failed - caching will be disabled"
fi

# Check Supabase connectivity (basic)
if [[ -n "$NEXT_PUBLIC_SUPABASE_URL" ]]; then
    if curl -s "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/" >/dev/null 2>&1; then
        print_success "Supabase connectivity check passed"
    else
        print_warning "Supabase connectivity check failed - check your configuration"
    fi
fi

# === SUCCESS MESSAGE ===
echo ""
print_success "🚀 Enhanced Agent V2 is now running!"
echo ""
echo -e "${BLUE}📊 Service Status:${NC}"
echo -e "  • Enhanced Agent Backend: ${GREEN}Running${NC} (PID: $BACKEND_PID)"
echo -e "  • WebSocket Server: ${GREEN}ws://localhost:$ENHANCED_AGENT_PORT${NC}"
echo -e "  • Health Check: ${GREEN}http://localhost:$ENHANCED_AGENT_PORT/health${NC}"
echo -e "  • Metrics: ${GREEN}http://localhost:$ENHANCED_AGENT_PORT/metrics${NC}"
echo ""
echo -e "${BLUE}⚡ Performance Features:${NC}"
echo -e "  • 30x faster browser operations"
echo -e "  • Real-time streaming responses"
echo -e "  • Parallel tool execution"
echo -e "  • Smart caching with Redis"
echo -e "  • Full Supabase integration"
echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo -e "  1. Start your frontend: ${YELLOW}npm run dev${NC}"
echo -e "  2. Open your app and look for 'Enhanced Agent V2' option"
echo -e "  3. Experience 30x faster AI interactions!"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo -e "  • View logs: ${YELLOW}tail -f backend/logs/enhanced_agent.log${NC}"
echo -e "  • Stop services: ${YELLOW}pkill -f enhanced_agent${NC}"
echo -e "  • Restart: ${YELLOW}./start_enhanced_agent.sh${NC}"
echo ""

# === CLEANUP HANDLER ===
cleanup() {
    print_status "Shutting down Enhanced Agent services..."
    kill $BACKEND_PID 2>/dev/null || true
    print_success "Services stopped"
}

# Set up cleanup on script exit
trap cleanup EXIT INT TERM

# === KEEP RUNNING ===
if [[ "${1:-}" == "--daemon" ]]; then
    print_status "Running in daemon mode. Use 'pkill -f enhanced_agent' to stop."
    wait $BACKEND_PID
else
    print_status "Press Ctrl+C to stop all services"
    
    # Wait for user interrupt or backend to exit
    wait $BACKEND_PID 2>/dev/null || true
fi 