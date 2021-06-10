from django.shortcuts import render
from django.views import View
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie, vary_on_headers

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

import json
import requests

# Create your views here.
class HomePage(View):
    template_name = 'index.html'

    def get(self, request):
        return render(request, self.template_name)

class StackOverflowAPI(APIView):
    """
    View to get the StackOverflowAPI

    * Requires authentication.
    """
    # authentication_classes = [SessionAuthentication, BasicAuthentication]
    # permission_classes = [IsAuthenticated]

    base_url = 'https://api.stackexchange.com'
    url = f'{base_url}/2.2/search/advanced'

    @method_decorator(cache_page(60*60*2))
    def get(self, request, format=None):
        """
        Return call from stack overflow
        """
        payload = {
            'order' : request.GET.get("order", 'desc'),
            'sort'  : request.GET.get("sort", 'activity'),
            'site'  : request.GET.get("site", 'stackoverflow'),
            'q'     : request.GET.get("q", None),
        }
        res = requests.get(self.url, params=payload)
        return Response(json.loads(res.content.decode("utf-8")))
