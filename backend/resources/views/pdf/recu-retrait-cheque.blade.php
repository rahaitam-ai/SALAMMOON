<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reçu de Retrait par Chèque</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #333; }
        .wrapper { padding: 24px; }
        .header { margin-bottom: 24px; }
        .header h1 { margin: 0; font-size: 22px; }
        .details, .summary { width: 100%; margin-bottom: 16px; }
        .details td, .summary td { padding: 8px; border: 1px solid #ddd; }
        .details th, .summary th { padding: 8px; border: 1px solid #ddd; background: #f5f5f5; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Reçu de Retrait par Chèque</h1>
            <p>Date : {{ $retrait->date_operation?->format('d/m/Y H:i') ?? now()->format('d/m/Y H:i') }}</p>
        </div>

        <table class="details">
            <tr>
                <th>Client titulaire</th>
                <td>{{ $retrait->account->client->nom }} {{ $retrait->account->client->prenom }}</td>
            </tr>
            <tr>
                <th>CIN titulaire</th>
                <td>{{ $retrait->account->client->cin }}</td>
            </tr>
            <tr>
                <th>Compte</th>
                <td>{{ $retrait->account->numero_compte }}</td>
            </tr>
            <tr>
                <th>Numéro de chèque</th>
                <td>{{ $retrait->cheque->numero_cheque }}</td>
            </tr>
            <tr>
                <th>Bénéficiaire</th>
                <td>{{ $retrait->cheque->beneficiaire_nom }} {{ $retrait->cheque->beneficiaire_prenom }}</td>
            </tr>
            <tr>
                <th>Montant</th>
                <td>{{ number_format($retrait->montant, 2, ',', ' ') }} Dhs</td>
            </tr>
        </table>

        <table class="summary">
            <tr>
                <th>Solde avant retrait</th>
                <td>{{ number_format($retrait->solde_avant, 2, ',', ' ') }} Dhs</td>
            </tr>
            <tr>
                <th>Solde après retrait</th>
                <td>{{ number_format($retrait->solde_apres, 2, ',', ' ') }} Dhs</td>
            </tr>
        </table>

        <p>Merci de votre confiance.</p>
    </div>
</body>
</html>
