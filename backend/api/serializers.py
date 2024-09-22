from rest_framework import serializers
from base.models import Item, ResumeInfo

class ItemSerializer(serializers.ModelSerializer): #inherits from ModelSerializer class
    class Meta:
        model = Item
        fields = '__all__' #serialize all the fields

class ResumeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeInfo
        fields = '__all__' #serialize all the fields