import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()


class _FallbackLLM:
    def invoke(self, *args, **kwargs):
        class _Response:
            content = (
                '{"status":"fallback","message":"Groq API key is missing or invalid. '
                'Set GROQ_API_KEY to enable AI generation."}'
            )

        return _Response()


class _ResilientLLM:
    def __init__(self):
        self._real_llm = None
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            self._real_llm = ChatGroq(
                model="llama-3.3-70b-versatile",
                api_key=api_key,
            )

    def invoke(self, *args, **kwargs):
        if self._real_llm is None:
            return _FallbackLLM().invoke(*args, **kwargs)

        try:
            return self._real_llm.invoke(*args, **kwargs)
        except Exception:
            return _FallbackLLM().invoke(*args, **kwargs)

    def __getattr__(self, name):
        if self._real_llm is not None:
            return getattr(self._real_llm, name)
        raise AttributeError(name)


def get_llm():
    return _ResilientLLM()
