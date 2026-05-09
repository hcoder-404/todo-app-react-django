from rest_framework import serializers 
# ye kya hai? ye django rest framework ka ek module hai jo data ko serialize aur deserialize karne ke liye use hota hai. iska use hum apne models ko json format me convert karne ke liye karte hain, taki hum apne api endpoints se data ko easily send aur receive kar sakein.
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'