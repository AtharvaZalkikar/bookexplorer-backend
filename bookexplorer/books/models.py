from django.db import models
from django.utils import timezone

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

    def __str__(self):
        return f"{self.title} by {self.author or 'Unknown'}"
