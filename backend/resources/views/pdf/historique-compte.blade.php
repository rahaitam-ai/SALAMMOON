<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Historique du Compte</title>
    <style>
        @page {
            size: A4;
            margin: 10mm;
        }
        html, body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 0;
            color: #2d2d2d;
        }
        * {
            box-sizing: border-box;
        }
        .header {
            padding: 16px;
            border-bottom: 3px solid #d4a017;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin: 16px 0;
        }
        .info-card {
            border: 1px solid #e0d6c2;
            border-left: 4px solid #d4a017;
            border-radius: 6px;
            background: #faf7f0;
            padding: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
        }
        th {
            background: #faf7f0;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.08em;
            padding: 10px 12px;
            text-align: left;
            color: #64748b;
            border-bottom: 1px solid #e0d6c2;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #f0ebe0;
        }
        .depot { color: #16a34a; }
        .retrait { color: #dc2626; }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 12px 16px;
            border-top: 2px solid #d4a017;
            background: #faf7f0;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="margin:0; color:#d4a017; text-transform: uppercase; letter-spacing:0.1em;">Historique du Compte</h2>
        <p style="margin:4px 0 0; color:#64748b;">{{ $account->numero_compte }}</p>
        <p style="margin:4px 0 0; color:#64748b;">Émis le {{ $issueDate }} à {{ $issueTime }}</p>
    </div>

    <div style="padding: 16px;">
        <div class="info-grid">
            <div class="info-card">
                <p style="margin:0; text-transform: uppercase; font-size:9px; letter-spacing:0.08em; color:#64748b;">Client</p>
                <p style="margin:4px 0 0; font-weight:bold;">{{ $client->nom }} {{ $client->prenom }}</p>
                <p style="margin:0;">CIN: {{ $client->cin }}</p>
            </div>
            <div class="info-card">
                <p style="margin:0; text-transform: uppercase; font-size:9px; letter-spacing:0.08em; color:#64748b;">Agence</p>
                <p style="margin:4px 0 0; font-weight:bold;">{{ $agenceName }}</p>
                <p style="margin:0;">{{ $agenceVille }}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th style="text-align:right;">Montant</th>
                    <th style="text-align:right;">Solde Avant</th>
                    <th style="text-align:right;">Solde Après</th>
                </tr>
            </thead>
            <tbody>
                @foreach($transactions as $op)
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($op['date'])->format('d/m/Y H:i') }}</td>
                        <td class="{{ $op['type'] }}">{{ $op['type'] === 'depot' ? 'Dépôt' : 'Retrait' }}</td>
                        <td style="text-align:right;" class="{{ $op['type'] }}">{{ $op['type'] === 'depot' ? '+' : '-' }}{{ number_format($op['montant'], 2, ',', ' ') }} MAD</td>
                        <td style="text-align:right;">{{ number_format($op['solde_avant'], 2, ',', ' ') }} MAD</td>
                        <td style="text-align:right;">{{ number_format($op['solde_apres'], 2, ',', ' ') }} MAD</td>
                    </tr>
                @endforeach
                @if(empty($transactions))
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 24px;">Aucune opération</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>

    <div class="footer">
        <table width="100%">
            <tr>
                <td style="font-size: 10px; color: #64748b;">
                    <strong>Al Barid Bank</strong> - Document officiel
                </td>
                <td style="text-align:right; font-size: 10px; color: #64748b;">
                    Référence: {{ $reference }}
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
