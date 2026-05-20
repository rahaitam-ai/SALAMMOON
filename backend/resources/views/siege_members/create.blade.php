<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajouter un nouveau membre</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .form-container {
            max-width: 600px;
            margin: 50px auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .form-header {
            margin-bottom: 30px;
            text-align: center;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
        }
        .form-header h2 {
            color: #333;
            font-weight: 700;
        }
        .btn-primary {
            background-color: #0d6efd;
            border: none;
            padding: 12px;
            font-weight: 600;
            border-radius: 8px;
        }
        .form-control:read-only {
            background-color: #e9ecef;
            cursor: not-allowed;
        }
        .id-badge {
            font-size: 0.9rem;
            background: #eee;
            padding: 5px 12px;
            border-radius: 20px;
            color: #666;
            margin-bottom: 10px;
            display: inline-block;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="form-container">
        <div class="form-header">
            <h2>Ajouter un nouveau membre</h2>
            <div class="id-badge">ID Suggéré : <span id="display-id">{{ $nextId }}</span></div>
        </div>

        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        @endif

        @if($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('siege_members.store') }}" method="POST">
            @csrf
            
            <div class="mb-3">
                <label for="nom" class="form-label">Nom</label>
                <input type="text" name="nom" id="nom" class="form-control" placeholder="Entrez le nom" value="{{ old('nom') }}" required>
            </div>

            <div class="mb-3">
                <label for="prenom" class="form-label">Prénom</label>
                <input type="text" name="prenom" id="prenom" class="form-control" placeholder="Entrez le prénom" value="{{ old('prenom') }}" required>
            </div>

            <div class="mb-4">
                <label for="email" class="form-label">Email (Généré automatiquement)</label>
                <input type="email" name="email" id="email" class="form-control" readonly placeholder="prenomnom.siegeID@gmail.com" value="{{ old('email') }}">
                <div class="form-text">Format: PrenomNom.siegeID@gmail.com</div>
            </div>

            <button type="submit" class="btn btn-primary w-100">Enregistrer le membre</button>
        </form>
    </div>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const nomInput = document.getElementById('nom');
        const prenomInput = document.getElementById('prenom');
        const emailInput = document.getElementById('email');
        const siegeId = {{ $nextId }};

        function generateEmail() {
            const nom = nomInput.value.trim().toLowerCase();
            const prenom = prenomInput.value.trim().toLowerCase();

            if (nom || prenom) {
                // Format: PrenomNom.siegeID@gmail.com
                // Example says haitam (nom), ragouby (prenom) -> ragoubyhaitam.siege5@gmail.com
                // So it's Prenom + Nom
                emailInput.value = `${prenom}${nom}.siege${siegeId}@gmail.com`;
            } else {
                emailInput.value = '';
            }
        }

        nomInput.addEventListener('input', generateEmail);
        prenomInput.addEventListener('input', generateEmail);
    });
</script>

</body>
</html>
