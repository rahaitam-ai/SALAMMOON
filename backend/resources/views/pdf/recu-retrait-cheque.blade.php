<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reçu de Retrait par Chèque - {{ $client->nom }} {{ $client->prenom }}</title>
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

        .section, .section-box {
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
        .mono {
            font-family: 'Courier New', monospace;
            letter-spacing: 1px;
        }
        .gold { color: #d4a017; }
        .green { color: #1a7a4a; }

        .balance-box {
            background: #fff5d2;
            border: 1px solid #ecd8a6;
            border-radius: 8px;
            padding: 10px 12px;
            margin-bottom: 8px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .balance-label {
            font-size: 9.5px;
            font-weight: bold;
            color: #777;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-bottom: 4px;
        }
        .balance-value {
            font-size: 16px;
            font-weight: bold;
            color: #0f1929;
        }

        .text-block {
            font-size: 9.5px;
            color: #555;
            line-height: 1.45;
            margin-bottom: 8px;
        }
        .text-block strong { color: #2d2d2d; }

        .details-row {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 8px;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .detail-card {
            flex: 1 1 140px;
            border: 1px solid #e8e0d0;
            border-radius: 8px;
            padding: 10px 12px;
            background: #fbfaf7;
        }
        .detail-title {
            font-size: 9px;
            font-weight: bold;
            color: #555;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }
        .detail-value {
            font-size: 10px;
            font-weight: 600;
            color: #1a1a1a;
        }

        .signature-section {
            margin-top: 10px;
            width: 100%;
            page-break-inside: avoid;
            break-inside: avoid;
        }
        .sig-table { width: 100%; border-collapse: collapse; }
        .sig-box {
            width: 44%;
            border: 1px dashed #c5b896;
            border-radius: 8px;
            padding: 10px;
            text-align: center;
            vertical-align: top;
            height: 80px;
        }
        .sig-box-spacer { width: 12%; }
        .sig-title {
            font-size: 9.5px;
            font-weight: bold;
            color: #555;
            margin-bottom: 4px;
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
                    <div class="title-fr">Reçu de Retrait par Chèque</div>
                    <div class="header-meta">
                        Date d'émission : <strong>{{ $issueDate }}</strong><br>
                        Heure d'émission : <strong>{{ $issueTime }}</strong><br>
                        Référence : <strong>{{ $reference }}</strong>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="certification">
        Nous confirmons avoir effectué le retrait par chèque suivant pour le compte mentionné ci-dessus, conformément aux conditions en vigueur.
        Ce reçu est délivré au client et valable sans réserve.
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
                    <td class="info-value">{{ $agenceName }}</td>
                </tr>
                <tr>
                    <td class="info-label">Code agence</td>
                    <td class="info-value">{{ $agenceCode }}</td>
                </tr>
                <tr>
                    <td class="info-label">Ville</td>
                    <td class="info-value">{{ $agenceVille }}</td>
                </tr>
            </table>
        </div>

        <div class="section-box">
            <div class="section-header">
                <table class="section-header-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="section-icon">&#9775;</td>
                        <td class="section-title-fr">INFORMATIONS DU CLIENT</td>
                    </tr>
                </table>
            </div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Nom complet</td>
                    <td class="info-value" style="font-size: 12px;">{{ strtoupper($client->nom) }} {{ $client->prenom }}</td>
                </tr>
                <tr>
                    <td class="info-label">CIN</td>
                    <td class="info-value">{{ $client->cin }}</td>
                </tr>
                <tr>
                    <td class="info-label">Téléphone</td>
                    <td class="info-value">{{ $client->phone ?? 'Non renseigné' }}</td>
                </tr>
            </table>
        </div>

        <div class="section-box">
            <div class="section-header">
                <table class="section-header-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="section-icon">&#9783;</td>
                        <td class="section-title-fr">INFORMATIONS DU COMPTE</td>
                    </tr>
                </table>
            </div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Numéro de compte</td>
                    <td class="info-value mono">{{ $account->numero_compte }}</td>
                </tr>
            </table>
        </div>

        <div class="section-box">
            <div class="section-header">
                <table class="section-header-table" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="section-icon">&#128176;</td>
                        <td class="section-title-fr">INFORMATIONS DU RETRAIT</td>
                    </tr>
                </table>
            </div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Solde avant</td>
                    <td class="info-value">{{ number_format($retrait->solde_avant, 2, ',', ' ') }} MAD</td>
                </tr>
                <tr>
                    <td class="info-label">Montant</td>
                    <td class="info-value" style="color: #dc2626;">{{ number_format($retrait->montant, 2, ',', ' ') }} MAD</td>
                </tr>
                <tr>
                    <td class="info-label">Nouveau solde</td>
                    <td class="info-value" style="color: #16a34a;">{{ number_format($retrait->solde_apres, 2, ',', ' ') }} MAD</td>
                </tr>
            </table>
        </div>

        <div class="details-row">
            <div class="detail-card">
                <div class="detail-title">Guichetier</div>
                <div class="detail-value">{{ $tellerName }}</div>
            </div>
            <div class="detail-card">
                <div class="detail-title">Date de l'opération</div>
                <div class="detail-value">{{ $issueDate }}</div>
            </div>
        </div>

        <div class="signature-section">
            <table class="sig-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="sig-box">
                        <div class="sig-title">Cachet de l'agence</div>
                    </td>
                    <td class="sig-box-spacer"></td>
                    <td class="sig-box">
                        <div class="sig-title">Signature autorisée</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <div class="footer">
        <table class="footer-table" cellpadding="0" cellspacing="0">
            <tr>
                <td class="footer-left">
                    <strong>Al Barid Bank</strong> · Document généré par le système interne de l'agence.
                </td>
                <td class="footer-right">
                    <span class="footer-brand">Reçu de Retrait par Chèque</span>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
