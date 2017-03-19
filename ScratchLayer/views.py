# from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import Http404
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
	return render(request,'ScratchLayer/index.html')
    #return HttpResponse("Hello, world. You're at the polls index.")

def prueba(request):
	return render(request,'ScratchLayer/prueba.html')

@csrf_exempt
def ajax(request): 

	print request.POST
	data= {
		'hola':request.POST.get("prueba",None)
	}

	return JsonResponse(data)