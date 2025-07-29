from django.contrib import admin

# Register your models here.
from .models import Book

'''
This gives you a clean admin interface to:
View all books
Edit any book
Search by title or author
'''
# ==============================================================
# 🛠️ Admin Panel Customization for Book Model
# ==============================================================

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title','author','published_date','created_at') # Show these fields in list view
    search_fields = ('title','author')  # Optional: search bar in admin
    readonly_fields = ('created_at',)   # Prevent editing created_at