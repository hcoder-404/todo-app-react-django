from django.urls import path
from . import views

urlpatterns = [

    # GET ALL TASKS
    path('tasks/', views.getTasks),

    # CREATE TASK
    path('tasks/create/', views.createTask),

    # UPDATE TASK
    path('tasks/update/<str:pk>/', views.updateTask),

    # DELETE TASK
    path('tasks/delete/<str:pk>/', views.deleteTask),

    # GET SINGLE TASK
    path('tasks/<str:pk>/', views.getTask),
]