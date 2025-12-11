# Déploiement du portfolio

Ce document explique comment fonctionne le pipeline de déploiement fourni et comment le personnaliser.

## Workflow GitHub Actions (fourni)

- Fichier : `.github/workflows/deploy.yml`
- Quand : `push` sur `main` ou `master`
- Ce que fait :
  - clone le dépôt
  - (optionnel) prépare l'environnement Node
  - déploie le contenu du répertoire racine sur la branche `gh-pages` via `peaceiris/actions-gh-pages`

Après le premier push sur `main` :

1. Allez dans les `Settings` du dépôt -> `Pages`.
2. Choisissez la source `Deploy from a branch` et sélectionnez `gh-pages` (ou attendez que GitHub Pages prenne la branche créée automatiquement).
3. Votre site sera disponible à l'URL indiquée (https://<votre-utilisateur>.github.io/<nom-du-repo>/).

## Personnaliser

- Si vous avez une étape de build (ex : site généré avec un static site generator), modifiez la section `Install / Build` pour exécuter `npm install` et `npm run build`, puis mettez `publish_dir` sur le dossier généré (ex: `public` ou `dist`).
- Pour un domaine personnalisé, ajoutez un fichier `CNAME` dans le dossier publié ou configurez la section Pages dans les Settings.

## Option : déploiement vers AWS S3 + CloudFront (exemple)

Si vous préférez déployer sur AWS S3 + CloudFront, voici un bref exemple (nécessite secrets `AWS_ACCESS_KEY_ID` et `AWS_SECRET_ACCESS_KEY` dans `Settings > Secrets`):

```yaml
# Exemple (à adapter) : .github/workflows/deploy-s3.yml
name: Deploy to S3
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-3
      - uses: jakejarvis/s3-sync-action@v0.5.1
        with:
          args: --acl public-read --delete
        env:
          AWS_S3_BUCKET: your-bucket-name

```

Remarques :
- Remplacez `your-bucket-name` et la région par vos valeurs.
- Configurez CloudFront pour invalider le cache si besoin.

## Prochaines étapes recommandées

- Pousser le dépôt sur GitHub (`git push origin main`).
- Vérifier l'exécution du workflow dans `Actions` et les logs si des erreurs apparaissent.
- Voulez-vous que je génère aussi un workflow prêt pour AWS S3/Azure/Netlify ?

## Déploiement sur VPS avec Docker (fourni)

Un workflow est ajouté : `.github/workflows/deploy_vps_docker.yml`.

Comportement :
- Lors d'un `push` sur `main` ou `master`, le workflow copie les fichiers du dépôt vers votre VPS (via `scp`) dans le chemin `DEPLOY_PATH` puis exécute des commandes SSH pour lancer `docker compose up --build -d`.

Sécrets requis dans `Settings > Secrets and variables > Actions` :
- `VPS_HOST` : IP ou hostname du VPS
- `VPS_USER` : utilisateur SSH sur le VPS (ex : `ubuntu`)
- `VPS_SSH_KEY` : clé privée SSH (format PEM) pour l'authentification
- `VPS_PORT` : port SSH (optionnel, par défaut 22)
- `DEPLOY_PATH` : chemin absolu sur le VPS où copier le projet (ex: `/home/ubuntu/portfolio`)

Prérequis sur le VPS :
- Docker et Docker Compose installés (ou le plugin `docker compose`)
- L'utilisateur SSH doit avoir les droits suffisants pour exécuter Docker (ou utilisez `sudo` dans les commandes si nécessaire)

Test local (sur VPS) :

1. Copier les fichiers sur le VPS (localement) :

```powershell
scp -r ./* ubuntu@1.2.3.4:/home/ubuntu/portfolio
```

2. Sur le VPS, dans le répertoire :

```bash
cd /home/ubuntu/portfolio
docker compose up --build -d
```

Si vous préférez que le workflow construise d'abord l'image et la pousse vers un registry (Docker Hub, GitHub Container Registry) puis que le VPS `docker pull` l'image, je peux ajouter cette variante (nécessite d'ajouter les secrets du registry).

