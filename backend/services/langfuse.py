import os
from langfuse import Langfuse

public_key = os.getenv("LANGFUSE_PUBLIC_KEY")
secret_key = os.getenv("LANGFUSE_SECRET_KEY")
host = os.getenv("LANGFUSE_HOST", "https://cloud.langfuse.com")

# Only create Langfuse instance if credentials are available
if public_key and secret_key:
    langfuse = Langfuse(
        public_key=public_key,
        secret_key=secret_key,
        host=host
    )
else:
    # Create a dummy object to prevent import errors
    class DummyLangfuse:
        def trace(self, *args, **kwargs):
            class DummyTrace:
                def update(self, *args, **kwargs): pass
                def span(self, *args, **kwargs): 
                    return DummyTrace()
                def generation(self, *args, **kwargs): 
                    return DummyTrace()
                def event(self, *args, **kwargs): pass
                def score(self, *args, **kwargs): pass
            return DummyTrace()
        
        def flush(self): pass
    
    langfuse = DummyLangfuse()
