from django.db import models
from django.utils import timezone
# from django.conf import settings  # to reference AUTH_USER_MODEL
from django.contrib.auth.models import User

# ==============================================================
# 📚 Book Model — Stores Book Metadata from Open Library
# ==============================================================

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100, blank=True, null=True)
    published_date = models.CharField(max_length=50, blank=True, null=True)
    isbn = models.CharField(max_length=20, blank=True, null=True)
    cover_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)  # stored in UTC
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # <== updated here

    def __str__(self):
        return f"{self.title} by {self.author or 'Unknown'}"
