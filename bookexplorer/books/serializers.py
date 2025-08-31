from rest_framework import serializers
from .models import Book

# ==============================================================
# 📦 Book Serializer — Handles Validation and Transformation
# ==============================================================

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ['owner','created_at']

    def validate_isbn(self, value):
        if value and len(value) > 20:
            raise serializers.ValidationError("ISBN too long.")
        return value

    '''
    This will:
        Convert "to kill a mockingbird" ➝ "To Kill A Mockingbird"
        Convert "harper lee" ➝ "Harper Lee"
    '''
    
    def validate_title(self, value):
        return value.title()
    
    def validate_author(self, value):
        return value.title() if value else value