from django.db import models

class Destination(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=100)
    image_url = models.URLField()
    category = models.CharField(max_length=50)

    def __str__(self):
        return self.name
