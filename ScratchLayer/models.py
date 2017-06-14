from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Users(models.Model):
	username = models.CharField(max_length=30)
	password = models.CharField(max_length=30)

	def __str__(self):
		return self.username

