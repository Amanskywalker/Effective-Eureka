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
from rest_framework.throttling import AnonRateThrottle

import json
import requests

# Create your views here.
class HomePage(View):
    template_name = 'index.html'

    def get(self, request):
        landing = request.GET.get('landing', True)
        return render(request, self.template_name, {'params' : request.GET, 'landing' : landing})

class AnonMinThrottle(AnonRateThrottle):
    scope = 'anon_min'

class AnonDayThrottle(AnonRateThrottle):
    scope = 'anon_day'

class StackOverflowAPI(APIView):
    """
    View to get the StackOverflowAPI
    """
    throttle_classes = [ AnonMinThrottle, AnonDayThrottle ]
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
            'filter'    : '!6W.6dPFDcrAXr',
            'order'     : request.GET.get("order", 'desc'),
            'sort'      : request.GET.get("sort", 'activity'),
            'site'      : request.GET.get("site", 'stackoverflow'),
            'q'         : request.GET.get("q", None),
            'page'      : request.GET.get("page", 1),
            'pagesize'  : request.GET.get("pagesize", 30),
            'answers'   : request.GET.get("answers", None),
            'body'      : request.GET.get("body", None),
            'tagged'    : request.GET.get("tagged", None),
            'title'     : request.GET.get("title", None),
            'views'     : request.GET.get("views", None),

        }
        res = requests.get(self.url, params=payload)
        print(res.url)
        return Response(json.loads(res.content.decode("utf-8")), status=200)
