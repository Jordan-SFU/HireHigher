from rest_framework import serializers
from base.models import Item

class ItemSerializer(serializers.ModelSerializer): #inherits from ModelSerializer class
    class Meta:
        model = Item
        fields = '__all__' #serialize all the fields