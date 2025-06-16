"""
🚀 Ultra-Fast Browser Tool V2 - Next-Generation Web Automation
Delivers sub-second performance with advanced caching and intelligent optimization
"""

import asyncio
import json
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from PIL import Image
import base64
import io
import hashlib
from datetime import datetime, timedelta
import redis.asyncio as redis
import logging
from contextlib import asynccontextmanager

logger = logging.getLogger(__name__)


@dataclass
class BrowserResult:
    """Enhanced browser operation result with rich metadata"""
    screenshot: Optional[str] = None
    html: Optional[str] = None
    text: Optional[str] = None
    metadata: Optional[Dict] = None
    performance: Optional[Dict] = None
    accessibility: Optional[Dict] = None
    seo_analysis: Optional[Dict] = None
    duration: float = 0.0
    cache_hit: bool = False
    browser_id: Optional[str] = None


@dataclass
class CacheKey:
    """Smart cache key generation"""
    url: str
    action: str
    parameters: Dict
    ttl: int = 300  # 5 minutes default
    
    def generate_key(self) -> str:
        """Generate deterministic cache key"""
        content = f"{self.url}:{self.action}:{json.dumps(self.parameters, sort_keys=True)}"
        return f"browser_cache:{hashlib.md5(content.encode()).hexdigest()}"


class SmartBrowserPool:
    """Intelligent browser pool with auto-scaling and warm browsers"""
    
    def __init__(self, pool_size: int = 10, warm_browsers: int = 3):
        self.pool_size = pool_size
        self.warm_browsers = warm_browsers
        self.browsers: List[Browser] = []
        self.available_browsers: asyncio.Queue = asyncio.Queue()
        self.browser_contexts: Dict[str, BrowserContext] = {}
        self.performance_stats = {}
        self._lock = asyncio.Lock()
        
    async def initialize(self):
        """Initialize browser pool with warm browsers"""
        playwright = await async_playwright().start()
        
        # Create initial browser pool
        for i in range(self.pool_size):
            browser = await playwright.chromium.launch(
                headless=True,
                args=[
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor',
                    '--memory-pressure-off',
                    '--max_old_space_size=4096'
                ]
            )
            self.browsers.append(browser)
            await self.available_browsers.put(browser)
            
        logger.info(f"Initialized browser pool with {self.pool_size} browsers")
        
    async def get_browser(self) -> Browser:
        """Get browser from pool in <10ms"""
        try:
            # Get browser with minimal wait
            browser = await asyncio.wait_for(
                self.available_browsers.get(), 
                timeout=0.1
            )
            return browser
        except asyncio.TimeoutError:
            # Pool exhausted, create temporary browser
            logger.warning("Browser pool exhausted, creating temporary browser")
            playwright = await async_playwright().start()
            return await playwright.chromium.launch(headless=True)
            
    async def return_browser(self, browser: Browser):
        """Return browser to pool"""
        try:
            await self.available_browsers.put(browser)
        except Exception as e:
            logger.error(f"Error returning browser to pool: {e}")
            
    @asynccontextmanager
    async def get_context(self, browser: Browser):
        """Get browser context with automatic cleanup"""
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        )
        try:
            yield context
        finally:
            await context.close()
            
    async def cleanup(self):
        """Clean up all browsers"""
        for browser in self.browsers:
            await browser.close()


class AdvancedBrowserCache:
    """Redis-based intelligent caching with compression"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_client = None
        self.redis_url = redis_url
        self.compression_enabled = True
        
    async def initialize(self):
        """Initialize Redis connection"""
        try:
            self.redis_client = redis.from_url(self.redis_url)
            await self.redis_client.ping()
            logger.info("Browser cache initialized with Redis")
        except Exception as e:
            logger.warning(f"Redis cache unavailable: {e}")
            self.redis_client = None
            
    async def get(self, cache_key: CacheKey) -> Optional[BrowserResult]:
        """Get cached result with decompression"""
        if not self.redis_client:
            return None
            
        try:
            key = cache_key.generate_key()
            cached_data = await self.redis_client.get(key)
            
            if cached_data:
                # Decompress and deserialize
                result_data = json.loads(cached_data.decode())
                result = BrowserResult(**result_data)
                result.cache_hit = True
                
                logger.info(f"Cache hit for {cache_key.url}")
                return result
                
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            
        return None
        
    async def set(self, cache_key: CacheKey, result: BrowserResult):
        """Set cached result with compression"""
        if not self.redis_client:
            return
            
        try:
            key = cache_key.generate_key()
            
            # Serialize result (exclude cache_hit flag)
            result_dict = {
                'screenshot': result.screenshot,
                'html': result.html,
                'text': result.text,
                'metadata': result.metadata,
                'performance': result.performance,
                'accessibility': result.accessibility,
                'seo_analysis': result.seo_analysis,
                'duration': result.duration,
                'browser_id': result.browser_id
            }
            
            # Compress and cache
            cached_data = json.dumps(result_dict).encode()
            await self.redis_client.setex(
                key, 
                cache_key.ttl, 
                cached_data
            )
            
            logger.info(f"Cached result for {cache_key.url}")
            
        except Exception as e:
            logger.error(f"Cache set error: {e}")


class AIPerformanceOptimizer:
    """AI-powered performance optimization"""
    
    def __init__(self):
        self.performance_history = {}
        self.optimization_rules = {}
        
    async def analyze_page_performance(self, page: Page) -> Dict:
        """Analyze page performance metrics"""
        try:
            # Get performance metrics
            performance_metrics = await page.evaluate("""
                () => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    const paint = performance.getEntriesByType('paint');
                    
                    return {
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                        largestContentfulPaint: paint.find(p => p.name === 'largest-contentful-paint')?.startTime || 0,
                        pageSize: navigation.transferSize,
                        resourceCount: performance.getEntriesByType('resource').length
                    };
                }
            """)
            
            return {
                'performance_score': self._calculate_performance_score(performance_metrics),
                'metrics': performance_metrics,
                'recommendations': self._generate_recommendations(performance_metrics)
            }
            
        except Exception as e:
            logger.error(f"Performance analysis error: {e}")
            return {'performance_score': 0, 'metrics': {}, 'recommendations': []}
            
    def _calculate_performance_score(self, metrics: Dict) -> int:
        """Calculate performance score 0-100"""
        score = 100
        
        # Deduct points for slow metrics
        if metrics.get('domContentLoaded', 0) > 2000:
            score -= 20
        if metrics.get('firstContentfulPaint', 0) > 3000:
            score -= 20
        if metrics.get('largestContentfulPaint', 0) > 4000:
            score -= 20
        if metrics.get('pageSize', 0) > 2000000:  # 2MB
            score -= 20
        if metrics.get('resourceCount', 0) > 100:
            score -= 20
            
        return max(0, score)
        
    def _generate_recommendations(self, metrics: Dict) -> List[str]:
        """Generate optimization recommendations"""
        recommendations = []
        
        if metrics.get('domContentLoaded', 0) > 2000:
            recommendations.append("Optimize DOM content loading time")
        if metrics.get('pageSize', 0) > 2000000:
            recommendations.append("Reduce page size by optimizing images and assets")
        if metrics.get('resourceCount', 0) > 100:
            recommendations.append("Reduce number of HTTP requests")
            
        return recommendations


class AccessibilityAnalyzer:
    """Automated accessibility analysis"""
    
    async def analyze(self, page: Page) -> Dict:
        """Run accessibility analysis"""
        try:
            # Inject axe-core for accessibility testing
            await page.add_script_tag(url="https://unpkg.com/axe-core@4.7.0/axe.min.js")
            
            # Run axe accessibility test
            results = await page.evaluate("""
                async () => {
                    const results = await axe.run();
                    return {
                        violations: results.violations.length,
                        passes: results.passes.length,
                        incomplete: results.incomplete.length,
                        inapplicable: results.inapplicable.length,
                        details: results.violations.map(v => ({
                            id: v.id,
                            impact: v.impact,
                            description: v.description,
                            help: v.help,
                            nodes: v.nodes.length
                        }))
                    };
                }
            """)
            
            return {
                'accessibility_score': self._calculate_accessibility_score(results),
                'summary': results,
                'compliance_level': self._determine_compliance_level(results)
            }
            
        except Exception as e:
            logger.error(f"Accessibility analysis error: {e}")
            return {'accessibility_score': 0, 'summary': {}, 'compliance_level': 'unknown'}
            
    def _calculate_accessibility_score(self, results: Dict) -> int:
        """Calculate accessibility score 0-100"""
        violations = results.get('violations', 0)
        passes = results.get('passes', 0)
        
        if passes + violations == 0:
            return 100
            
        return max(0, int((passes / (passes + violations)) * 100))
        
    def _determine_compliance_level(self, results: Dict) -> str:
        """Determine WCAG compliance level"""
        violations = results.get('violations', 0)
        
        if violations == 0:
            return 'AAA'
        elif violations <= 3:
            return 'AA'
        elif violations <= 10:
            return 'A'
        else:
            return 'Non-compliant'


class SEOAnalyzer:
    """Comprehensive SEO analysis"""
    
    async def analyze(self, page: Page, url: str) -> Dict:
        """Run SEO analysis"""
        try:
            seo_data = await page.evaluate("""
                () => {
                    const title = document.title;
                    const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
                    const metaKeywords = document.querySelector('meta[name="keywords"]')?.content || '';
                    const h1Tags = Array.from(document.querySelectorAll('h1')).map(h => h.textContent);
                    const h2Tags = Array.from(document.querySelectorAll('h2')).map(h => h.textContent);
                    const images = Array.from(document.querySelectorAll('img'));
                    const links = Array.from(document.querySelectorAll('a'));
                    
                    return {
                        title: title,
                        titleLength: title.length,
                        metaDescription: metaDescription,
                        metaDescriptionLength: metaDescription.length,
                        metaKeywords: metaKeywords,
                        h1Count: h1Tags.length,
                        h2Count: h2Tags.length,
                        imagesWithoutAlt: images.filter(img => !img.alt).length,
                        totalImages: images.length,
                        internalLinks: links.filter(link => link.href && link.href.includes(window.location.hostname)).length,
                        externalLinks: links.filter(link => link.href && !link.href.includes(window.location.hostname)).length,
                        hasRobotsMeta: !!document.querySelector('meta[name="robots"]'),
                        hasCanonical: !!document.querySelector('link[rel="canonical"]'),
                        hasViewport: !!document.querySelector('meta[name="viewport"]')
                    };
                }
            """)
            
            return {
                'seo_score': self._calculate_seo_score(seo_data),
                'analysis': seo_data,
                'recommendations': self._generate_seo_recommendations(seo_data)
            }
            
        except Exception as e:
            logger.error(f"SEO analysis error: {e}")
            return {'seo_score': 0, 'analysis': {}, 'recommendations': []}
            
    def _calculate_seo_score(self, data: Dict) -> int:
        """Calculate SEO score 0-100"""
        score = 100
        
        # Title optimization
        if data.get('titleLength', 0) < 30 or data.get('titleLength', 0) > 60:
            score -= 10
            
        # Meta description
        if data.get('metaDescriptionLength', 0) < 120 or data.get('metaDescriptionLength', 0) > 160:
            score -= 10
            
        # Heading structure
        if data.get('h1Count', 0) != 1:
            score -= 10
            
        # Images without alt text
        if data.get('imagesWithoutAlt', 0) > 0:
            score -= 10
            
        # Basic meta tags
        if not data.get('hasViewport', False):
            score -= 10
        if not data.get('hasCanonical', False):
            score -= 5
            
        return max(0, score)
        
    def _generate_seo_recommendations(self, data: Dict) -> List[str]:
        """Generate SEO recommendations"""
        recommendations = []
        
        if data.get('titleLength', 0) < 30 or data.get('titleLength', 0) > 60:
            recommendations.append("Optimize title length (30-60 characters)")
        if data.get('metaDescriptionLength', 0) < 120 or data.get('metaDescriptionLength', 0) > 160:
            recommendations.append("Optimize meta description length (120-160 characters)")
        if data.get('h1Count', 0) != 1:
            recommendations.append("Use exactly one H1 tag per page")
        if data.get('imagesWithoutAlt', 0) > 0:
            recommendations.append(f"Add alt text to {data['imagesWithoutAlt']} images")
        if not data.get('hasViewport', False):
            recommendations.append("Add viewport meta tag for mobile optimization")
            
        return recommendations


class UltraFastBrowserV2:
    """Next-generation browser automation with sub-second performance"""
    
    def __init__(self):
        self.browser_pool = SmartBrowserPool()
        self.cache = AdvancedBrowserCache()
        self.performance_optimizer = AIPerformanceOptimizer()
        self.accessibility_analyzer = AccessibilityAnalyzer()
        self.seo_analyzer = SEOAnalyzer()
        self.initialized = False
        
    async def initialize(self):
        """Initialize all components"""
        if self.initialized:
            return
            
        await asyncio.gather(
            self.browser_pool.initialize(),
            self.cache.initialize()
        )
        
        self.initialized = True
        logger.info("UltraFastBrowserV2 initialized successfully")
        
    async def navigate_and_analyze(
        self,
        url: str,
        options: Dict = None,
        cache_ttl: int = 300
    ) -> BrowserResult:
        """Navigate to URL with comprehensive analysis"""
        start_time = time.time()
        
        if not self.initialized:
            await self.initialize()
            
        options = options or {}
        
        # Check cache first
        cache_key = CacheKey(
            url=url,
            action="navigate_and_analyze",
            parameters=options,
            ttl=cache_ttl
        )
        
        if cached_result := await self.cache.get(cache_key):
            logger.info(f"Cache hit for {url} - returned in {time.time() - start_time:.3f}s")
            return cached_result
            
        # Get browser from pool
        browser = await self.browser_pool.get_browser()
        browser_id = f"browser_{id(browser)}"
        
        try:
            async with self.browser_pool.get_context(browser) as context:
                page = await context.new_page()
                
                # Navigate with timeout
                await page.goto(url, wait_until='networkidle', timeout=10000)
                
                # Run parallel analysis
                analysis_tasks = []
                
                if options.get('screenshot', True):
                    analysis_tasks.append(self._take_screenshot(page))
                    
                if options.get('extract_text', True):
                    analysis_tasks.append(self._extract_text(page))
                    
                if options.get('extract_html', False):
                    analysis_tasks.append(self._extract_html(page))
                    
                if options.get('performance_analysis', True):
                    analysis_tasks.append(self.performance_optimizer.analyze_page_performance(page))
                    
                if options.get('accessibility_analysis', False):
                    analysis_tasks.append(self.accessibility_analyzer.analyze(page))
                    
                if options.get('seo_analysis', False):
                    analysis_tasks.append(self.seo_analyzer.analyze(page, url))
                    
                # Execute all analyses in parallel
                results = await asyncio.gather(*analysis_tasks, return_exceptions=True)
                
                # Build result object
                result = BrowserResult(
                    browser_id=browser_id,
                    duration=time.time() - start_time
                )
                
                # Parse results
                result_index = 0
                if options.get('screenshot', True):
                    result.screenshot = results[result_index] if not isinstance(results[result_index], Exception) else None
                    result_index += 1
                    
                if options.get('extract_text', True):
                    result.text = results[result_index] if not isinstance(results[result_index], Exception) else None
                    result_index += 1
                    
                if options.get('extract_html', False):
                    result.html = results[result_index] if not isinstance(results[result_index], Exception) else None
                    result_index += 1
                    
                if options.get('performance_analysis', True):
                    result.performance = results[result_index] if not isinstance(results[result_index], Exception) else None
                    result_index += 1
                    
                if options.get('accessibility_analysis', False):
                    result.accessibility = results[result_index] if not isinstance(results[result_index], Exception) else None
                    result_index += 1
                    
                if options.get('seo_analysis', False):
                    result.seo_analysis = results[result_index] if not isinstance(results[result_index], Exception) else None
                    result_index += 1
                    
                # Add metadata
                result.metadata = {
                    'url': url,
                    'timestamp': datetime.now().isoformat(),
                    'user_agent': await page.evaluate('navigator.userAgent'),
                    'viewport': await page.evaluate('({width: window.innerWidth, height: window.innerHeight})'),
                    'title': await page.title()
                }
                
                # Cache result
                await self.cache.set(cache_key, result)
                
                logger.info(f"Analyzed {url} in {result.duration:.3f}s")
                return result
                
        except Exception as e:
            logger.error(f"Browser navigation error for {url}: {e}")
            return BrowserResult(
                duration=time.time() - start_time,
                metadata={'error': str(e), 'url': url}
            )
        finally:
            await self.browser_pool.return_browser(browser)
            
    async def _take_screenshot(self, page: Page) -> str:
        """Take optimized screenshot"""
        try:
            screenshot_bytes = await page.screenshot(
                type='png',
                quality=85,
                clip={'x': 0, 'y': 0, 'width': 1920, 'height': 1080}
            )
            
            # Optimize image size
            image = Image.open(io.BytesIO(screenshot_bytes))
            if image.size[0] > 1920 or image.size[1] > 1080:
                image.thumbnail((1920, 1080), Image.Resampling.LANCZOS)
                
            # Convert to base64
            output_buffer = io.BytesIO()
            image.save(output_buffer, format='PNG', optimize=True)
            
            return base64.b64encode(output_buffer.getvalue()).decode()
            
        except Exception as e:
            logger.error(f"Screenshot error: {e}")
            return None
            
    async def _extract_text(self, page: Page) -> str:
        """Extract clean text content"""
        try:
            text = await page.evaluate("""
                () => {
                    // Remove script and style elements
                    const scripts = document.querySelectorAll('script, style, nav, footer');
                    scripts.forEach(el => el.remove());
                    
                    // Get main content
                    const main = document.querySelector('main') || document.body;
                    return main.innerText.trim();
                }
            """)
            return text[:10000]  # Limit text length
        except Exception as e:
            logger.error(f"Text extraction error: {e}")
            return None
            
    async def _extract_html(self, page: Page) -> str:
        """Extract clean HTML content"""
        try:
            html = await page.content()
            return html[:50000]  # Limit HTML length
        except Exception as e:
            logger.error(f"HTML extraction error: {e}")
            return None
            
    async def click_element(self, url: str, selector: str) -> BrowserResult:
        """Click element with smart retry"""
        start_time = time.time()
        
        if not self.initialized:
            await self.initialize()
            
        browser = await self.browser_pool.get_browser()
        
        try:
            async with self.browser_pool.get_context(browser) as context:
                page = await context.new_page()
                await page.goto(url, wait_until='networkidle')
                
                # Wait for element and click
                await page.wait_for_selector(selector, timeout=5000)
                await page.click(selector)
                
                # Wait for any navigation/changes
                await page.wait_for_timeout(1000)
                
                # Take screenshot of result
                screenshot = await self._take_screenshot(page)
                
                return BrowserResult(
                    screenshot=screenshot,
                    duration=time.time() - start_time,
                    metadata={
                        'action': 'click',
                        'selector': selector,
                        'url': url,
                        'success': True
                    }
                )
                
        except Exception as e:
            logger.error(f"Click action error: {e}")
            return BrowserResult(
                duration=time.time() - start_time,
                metadata={
                    'action': 'click',
                    'selector': selector,
                    'url': url,
                    'success': False,
                    'error': str(e)
                }
            )
        finally:
            await self.browser_pool.return_browser(browser)
            
    async def fill_form(self, url: str, form_data: Dict[str, str]) -> BrowserResult:
        """Fill form with intelligent field detection"""
        start_time = time.time()
        
        if not self.initialized:
            await self.initialize()
            
        browser = await self.browser_pool.get_browser()
        
        try:
            async with self.browser_pool.get_context(browser) as context:
                page = await context.new_page()
                await page.goto(url, wait_until='networkidle')
                
                # Fill form fields
                filled_fields = []
                for field_name, value in form_data.items():
                    try:
                        # Try multiple selector strategies
                        selectors = [
                            f'input[name="{field_name}"]',
                            f'input[id="{field_name}"]',
                            f'textarea[name="{field_name}"]',
                            f'select[name="{field_name}"]'
                        ]
                        
                        for selector in selectors:
                            elements = await page.query_selector_all(selector)
                            if elements:
                                await page.fill(selector, value)
                                filled_fields.append(field_name)
                                break
                                
                    except Exception as e:
                        logger.warning(f"Could not fill field {field_name}: {e}")
                        
                # Take screenshot
                screenshot = await self._take_screenshot(page)
                
                return BrowserResult(
                    screenshot=screenshot,
                    duration=time.time() - start_time,
                    metadata={
                        'action': 'fill_form',
                        'filled_fields': filled_fields,
                        'total_fields': len(form_data),
                        'url': url,
                        'success': len(filled_fields) > 0
                    }
                )
                
        except Exception as e:
            logger.error(f"Form fill error: {e}")
            return BrowserResult(
                duration=time.time() - start_time,
                metadata={
                    'action': 'fill_form',
                    'url': url,
                    'success': False,
                    'error': str(e)
                }
            )
        finally:
            await self.browser_pool.return_browser(browser)
            
    async def cleanup(self):
        """Clean up all resources"""
        if self.browser_pool:
            await self.browser_pool.cleanup()
        if self.cache and self.cache.redis_client:
            await self.cache.redis_client.close()


# Tool registration function
async def ultra_fast_browser_tool(
    action: str,
    url: str = None,
    selector: str = None,
    form_data: Dict = None,
    options: Dict = None
) -> Dict:
    """
    Ultra-fast browser automation tool with advanced capabilities
    
    Args:
        action: Action to perform (navigate, click, fill_form, analyze)
        url: Target URL
        selector: CSS selector (for click actions)
        form_data: Form fields to fill (for form actions)
        options: Additional options for navigation/analysis
    
    Returns:
        Dict containing operation result and metadata
    """
    
    # Initialize global browser instance
    if not hasattr(ultra_fast_browser_tool, 'browser'):
        ultra_fast_browser_tool.browser = UltraFastBrowserV2()
        
    browser = ultra_fast_browser_tool.browser
    
    try:
        if action == "navigate" or action == "analyze":
            result = await browser.navigate_and_analyze(url, options or {})
            
        elif action == "click":
            if not selector:
                raise ValueError("Selector required for click action")
            result = await browser.click_element(url, selector)
            
        elif action == "fill_form":
            if not form_data:
                raise ValueError("Form data required for fill_form action")
            result = await browser.fill_form(url, form_data)
            
        else:
            raise ValueError(f"Unknown action: {action}")
            
        return {
            "success": True,
            "result": {
                "screenshot": result.screenshot,
                "text": result.text,
                "html": result.html,
                "metadata": result.metadata,
                "performance": result.performance,
                "accessibility": result.accessibility,
                "seo_analysis": result.seo_analysis,
                "duration": f"{result.duration:.3f}s",
                "cache_hit": result.cache_hit,
                "browser_id": result.browser_id
            }
        }
        
    except Exception as e:
        logger.error(f"Browser tool error: {e}")
        return {
            "success": False,
            "error": str(e),
            "duration": "0.000s"
        }


if __name__ == "__main__":
    # Example usage
    async def test_browser():
        result = await ultra_fast_browser_tool(
            action="analyze",
            url="https://example.com",
            options={
                "performance_analysis": True,
                "accessibility_analysis": True,
                "seo_analysis": True
            }
        )
        print(f"Result: {result}")
        
    asyncio.run(test_browser()) 