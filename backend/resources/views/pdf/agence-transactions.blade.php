<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Historique des Transactions - {{ $agence->nom }}</title>
    <style>
        @page {
            size: A4;
            margin: 10mm;
        }
        html, body {
            font-size: 11px;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            color: #2d2d2d;
            background: #ffffff;
            line-height: 1.3;
        }

        .header {
            padding: 16px 16px 12px;
            border-bottom: 3px solid #d4a017;
        }
        .header-table { width: 100%; }
        .header-left { width: 40%; vertical-align: middle; }
        .header-right { width: 60%; vertical-align: middle; text-align: right; }
        .logo-img {
            height: 90px;
            width: auto;
        }
        .title-fr {
            font-size: 14px;
            font-weight: bold;
            color: #2d2d2d;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }
        .header-meta {
            font-size: 9px;
            color: #777;
            margin-top: 6px;
            line-height: 1.4;
        }
        .header-meta strong { color: #2d2d2d; }

        .certification {
            padding: 10px 16px;
            font-size: 9.5px;
            color: #555;
            line-height: 1.5;
            border-bottom: 1px solid #e8e0d0;
            background: #fefdfb;
            margin-bottom: 8px;
        }
        .certification strong { color: #2d2d2d; }

        .content { padding: 0 16px 10px; }

        .section-box {
            border: 1px solid #e0d6c2;
            border-left: 4px solid #d4a017;
            border-radius: 6px;
            margin-bottom: 8px;
            background: #fefdfb;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .section-header {
            padding: 8px 12px;
            border-bottom: 1px solid #ece6d8;
            background: #faf7f0;
        }
        .section-header-table { width: 100%; }
        .section-icon {
            width: 26px;
            height: 26px;
            background: #f5eed9;
            border: 1px solid #e8dfc8;
            border-radius: 6px;
            text-align: center;
            line-height: 26px;
            font-size: 12px;
            color: #d4a017;
            vertical-align: middle;
        }
        .section-title-fr {
            font-size: 11px;
            font-weight: bold;
            color: #2d2d2d;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            vertical-align: middle;
            padding-left: 8px;
        }

        .info-table { width: 100%; border-collapse: collapse; }
        .info-table td {
            padding: 5px 10px;
            border-bottom: 1px solid #f0ebe0;
            vertical-align: top;
        }
        .info-table tr:last-child td { border-bottom: none; }
        .info-label {
            width: 35%;
            font-weight: 600;
            color: #666;
            font-size: 10px;
        }
        .info-value {
            width: 65%;
            color: #1a1a1a;
            font-weight: 600;
            font-size: 10px;
        }

        .transactions-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0;
        }
        .transactions-table thead {
            background: #faf7f0;
            border-bottom: 2px solid #d4a017;
        }
        .transactions-table th {
            padding: 8px 10px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
            color: #2d2d2d;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            border-bottom: 1px solid #e8dfc8;
        }
        .transactions-table td {
            padding: 6px 10px;
            border-bottom: 1px solid #f0ebe0;
            font-size: 10px;
        }
        .transactions-table tr:last-child td {
            border-bottom: none;
        }
        .montant-right {
            text-align: right;
            font-weight: 600;
            color: #1a7a4a;
        }
        .no-transactions {
            padding: 20px;
            text-align: center;
            color: #d4a017;
            font-weight: bold;
            font-size: 11px;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 8px 16px;
            border-top: 2px solid #d4a017;
            background: #faf8f4;
        }
        .footer-table { width: 100%; }
        .footer-left {
            font-size: 8.5px;
            color: #777;
            vertical-align: middle;
        }
        .footer-left strong { color: #2d2d2d; }
        .footer-right {
            text-align: right;
            vertical-align: middle;
        }
        .footer-brand {
            font-size: 9.5px;
            font-weight: bold;
            color: #2d2d2d;
            letter-spacing: 0.8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <table class="header-table" cellpadding="0" cellspacing="0">
            <tr>
                <td class="header-left">
                    @if(file_exists(public_path('images/al-barid-bank.jpg')))
                        <img src="{{ public_path('images/al-barid-bank.jpg') }}" class="logo-img" alt="Al Barid Bank">
                    @endif
                </td>
                <td class="header-right">
                    <div class="title-fr">Historique des Transactions</div>
                    <div class="header-meta">
                        Date de génération : <strong>{{ $generatedDate }}</strong><br>
                        Heure de génération : <strong>{{ $generatedTime }}</strong>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="certification">
        Document récapitulatif de l'historique des transactions de l'agence. Ce document est généré automatiquement à titre informatif et valable comme attestation des opérations effectuées.
    </div>

    <div class="content">
        <div class="section-box">
            <div class="section-header">
                <table class="section-header-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="section-icon">&#9962;</td>
                        <td class="section-title-fr">INFORMATIONS DE L'AGENCE</td>
                    </tr>
                </table>
            </div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Nom de l'agence</td>
                    <td class="info-value">{{ $agence->nom }}</td>
                </tr>
                <tr>
                    <td class="info-label">Code agence</td>
                    <td class="info-value">{{ $agence->code_agence }}</td>
                </tr>
                <tr>
                    <td class="info-label">Ville</td>
                    <td class="info-value">{{ $agence->ville }}</td>
                </tr>
                <tr>
                    <td class="info-label">Région</td>
                    <td class="info-value">{{ $agence->region }}</td>
                </tr>
            </table>
        </div>

        <div class="section-box">
            <div class="section-header">
                <table class="section-header-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="section-icon">📋</td>
                        <td class="section-title-fr">PÉRIODE ET STATISTIQUES</td>
                    </tr>
                </table>
            </div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Période couverte</td>
                    <td class="info-value">{{ $periodStart }} au {{ $periodEnd }}</td>
                </tr>
                <tr>
                    <td class="info-label">Nombre de transactions</td>
                    <td class="info-value">{{ count($transactions) }}</td>
                </tr>
                <tr>
                    <td class="info-label">Montant total</td>
                    <td class="info-value">{{ number_format($totalAmount, 2, ',', ' ') }} MAD</td>
                </tr>
            </table>
        </div>

        @if(count($transactions) > 0)
            <div class="section-box">
                <div class="section-header">
                    <table class="section-header-table" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="section-icon">&#128176;</td>
                            <td class="section-title-fr">DÉTAIL DES TRANSACTIONS</td>
                        </tr>
                    </table>
                </div>
                <table class="transactions-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th class="montant-right">Montant (MAD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($transactions as $t)
                            <tr>
                                <td>{{ $t['date_formatted'] }}</td>
                                <td>{{ $t['type'] }}</td>
                                <td class="montant-right">{{ number_format($t['montant'], 2, ',', ' ') }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="section-box">
                <div class="no-transactions">
                    ⚠️ Aucune transaction disponible pour cette période.
                </div>
            </div>
        @endif
    </div>

    <div class="footer">
        <table class="footer-table" cellpadding="0" cellspacing="0">
            <tr>
                <td class="footer-left">
                    Généré le {{ $generatedDate }} à {{ $generatedTime }} | Agence: {{ $agence->nom }}
                </td>
                <td class="footer-right">
                    <span class="footer-brand">AL BARID BANK</span>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>

