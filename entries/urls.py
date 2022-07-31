from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),

    # API
    path("api/add", views.add_api, name="add_api"),
    path("api/delete/<int:id>", views.delete_api, name="delete_api"),
    path("api/entries", views.entries_api, name="entries_api")
]