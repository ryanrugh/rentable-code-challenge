from django.db import models

# Create your models here.
# The candidate will define the Transaction model in this file.

class Tenant(models.Model):
    name = models.CharField(max_length=255)
    unit = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    class TransactionType(models.TextChoices):
        PAYMENT = 'payment', 'Payment'
        CHARGE = 'charge', 'Charge'

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='transactions')
    date = models.DateField()
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=TransactionType.choices, null=True, default=None)

    def __str__(self):
        return f"{self.date} - {self.description} ({self.amount})" 