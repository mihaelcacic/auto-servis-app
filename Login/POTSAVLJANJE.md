# Postavljanje .env datoteke za Spring Boot projekt

Ovaj projekt koristi OAuth2 autentifikaciju (npr. GitHub, Google).  
Kako bi zaštitili svoje Client ID i Client Secret vrijednosti, ne smiju se pushati na GitHub.

Umjesto toga, potrebno ih je postaviti lokalno pomoću `.env` datoteke ili kao environment varijable.

---

## 1. Kreiranje `.env` datoteke

U root direktoriju projekta napravite datoteku `.env` i u nju upišite:

```env
# GitHub OAuth konfiguracija
GITHUB_CLIENT_ID=Ov23lidIf0LbgxQPt7DW
GITHUB_CLIENT_SECRET=837c205478a1e43da9c959d1f968fd579a452b3a

# Google OAuth konfiguracija (ako se koristi)
GOOGLE_CLIENT_ID=975117473259-cvfef4vp5f9q8pkapgucdectr3om9tp6.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

Ili samo direktno u application.properties zamjenite vrijednosti sa stvarnima



