from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^prueba/', views.prueba, name='prueba'),
    url(r'^ajaxPPrin/$', views.ajaxPPrin, name='vali'),
    url(r'^ajaxSniff/$', views.ajaxSniff, name='sni'),
]