from django.db import models

# Create your models here.
class Entry(models.Model):
    entry = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.id}: {self.entry}"