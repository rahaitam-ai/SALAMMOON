<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Avis de Rejet de Chèque</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #333; }
        .wrapper { padding: 24px; }
        .header { margin-bottom: 24px; }
        .header h1 { margin: 0; font-size: 22px; }
        .details { width: 100%; margin-bottom: 16px; }
        .details td { padding: 8px; border: 1px solid #ddd; }
        .details th { padding: 8px; border: 1px solid #ddd; background: #f5f5f5; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Avis de rejet de chèque</h1>
            <p>Date : {{ now()->format('d/m/Y H:i') }}</p>
        </div>

        <table class="details">
            <tr>
                <th>Numéro de chèque</th>
                <td>{{ $cheque->numero_cheque }}</td>
            </tr>
            <tr>
                <th>Montant</th>
                <td>{{ number_format($cheque->montant, 2, ',', ' ') }} Dhs</td>
            </tr>
            <tr>
                <th>Compte titulaire</th>
                <td>{{ $account->numero_compte }}</td>
            </tr>
            <tr>
                <th>Titulaire</th>
                <td>{{ $account->client->nom }} {{ $account->client->prenom }}</td>
            </tr>
            <tr>
                <th>Bénéficiaire</th>
                <td>{{ $cheque->beneficiaire_nom }} {{ $cheque->beneficiaire_prenom }}</td>
            </tr>
            <tr>
                <th>Motif</th>
                <td>{{ $motif }}</td>
            </tr>
        </table>

        <p>Ce chèque a été rejeté en raison d'un solde insuffisant.</p>
    </div>
</body>
</html>
