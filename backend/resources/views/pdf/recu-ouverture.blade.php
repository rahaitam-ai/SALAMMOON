<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reçu d'ouverture de compte - {{ $client->nom }} {{ $client->prenom }}</title>
    <style>
        @page { margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            color: #2d2d2d;
            background: #ffffff;
            font-size: 11px;
            line-height: 1.4;
        }

        /* ── HEADER ── */
        .header {
            padding: 25px 40px 20px;
            border-bottom: 4px solid #d4a017;
        }
        .header-table { width: 100%; }
        .header-left { width: 50%; vertical-align: middle; }
        .header-right { width: 50%; vertical-align: middle; text-align: right; }
        .logo-img {
            height: 120px;
            width: auto;
        }
        .title-fr {
            font-size: 16px;
            font-weight: bold;
            color: #2d2d2d;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .header-meta {
            font-size: 10px;
            color: #777;
            margin-top: 8px;
        }
        .header-meta strong { color: #2d2d2d; }

        /* ── CERTIFICATION ── */
        .certification {
            padding: 14px 40px;
            font-size: 10px;
            color: #555;
            line-height: 1.5;
            border-bottom: 1px solid #e8e0d0;
            background: #fefdfb;
        }
        .certification strong { color: #2d2d2d; }

        /* ── CONTENT ── */
        .content { padding: 12px 40px 20px; }

        /* ── SECTION BOX ── */
        .section-box {
            border: 1px solid #e0d6c2;
            border-left: 4px solid #d4a017;
            border-radius: 6px;
            margin-bottom: 14px;
            background: #fefdfb;
        }
        .section-header {
            padding: 10px 16px;
            border-bottom: 1px solid #ece6d8;
            background: #faf7f0;
        }
        .section-header-table { width: 100%; }
        .section-icon {
            width: 28px;
            height: 28px;
            background: #f5eed9;
            border: 1px solid #e8dfc8;
            border-radius: 6px;
            text-align: center;
            line-height: 28px;
            font-size: 13px;
            color: #d4a017;
            vertical-align: middle;
        }
        .section-title-fr {
            font-size: 12px;
            font-weight: bold;
            color: #2d2d2d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            vertical-align: middle;
            padding-left: 10px;
        }

        /* ── INFO TABLE ── */
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 7px 16px;
            border-bottom: 1px solid #f0ebe0;
            vertical-align: top;
        }
        .info-table tr:last-child td { border-bottom: none; }
        .info-label {
            width: 35%;
            font-weight: 600;
            color: #666;
            font-size: 10.5px;
        }
        .info-value {
            width: 65%;
            color: #1a1a1a;
            font-weight: 600;
            font-size: 11px;
        }
        .mono {
            font-family: 'Courier New', monospace;
            letter-spacing: 1px;
        }
        .gold { color: #d4a017; }
        .green { color: #1a7a4a; }
        .red { color: #b83232; }

        /* ── SIGNATURE ── */
        .signature-section {
            margin-top: 20px;
            width: 100%;
        }
        .sig-table { width: 100%; border-collapse: collapse; }
        .sig-box {
            width: 44%;
            border: 1px dashed #c5b896;
            border-radius: 8px;
            padding: 12px;
            text-align: center;
            vertical-align: top;
            height: 90px;
        }
        .sig-box-spacer { width: 12%; }
        .sig-title {
            font-size: 10px;
            font-weight: bold;
            color: #555;
            margin-bottom: 6px;
        }

        /* ── FOOTER ── */
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 12px 40px;
            border-top: 3px solid #d4a017;
            background: #faf8f4;
        }
        .footer-table { width: 100%; }
        .footer-left {
            font-size: 9px;
            color: #777;
            vertical-align: middle;
        }
        .footer-left strong { color: #2d2d2d; }
        .footer-right {
            text-align: right;
            vertical-align: middle;
        }
        .footer-brand {
            font-size: 11px;
            font-weight: bold;
            color: #2d2d2d;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <!-- HEADER -->
    <div class="header">
        <table class="header-table" cellpadding="0" cellspacing="0">
            <tr>
                <td class="header-left">
                    <img src="{{ public_path('images/al-barid-bank.jpg') }}" class="logo-img" alt="Al Barid Bank">
                </td>
                <td class="header-right">
                    <div class="title-fr">Reçu d'ouverture de compte</div>
                    <div class="header-meta">
                        Date d'ouverture : <strong>{{ $creationDate }}</strong><br>
                        N° de reçu : <strong>ABR{{ date('Ymd') }}{{ str_pad($account->id, 4, '0', STR_PAD_LEFT) }}</strong>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- CERTIFICATION -->
    <div class="certification">
        Nous soussignés, <strong>AL BARID BANK</strong>, certifions par la présente que le compte ci-dessous a été ouvert conformément
        à la réglementation en vigueur.
    </div>

    <!-- CONTENT -->
    <div class="content">

        <!-- Section 1: Informations du Compte -->
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
                    <td class="info-label">Type de compte</td>
                    <td class="info-value">{{ $account->type->name ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td class="info-label">Numéro de compte</td>
                    <td class="info-value mono">{{ $account->numero_compte }}</td>
                </tr>
                <tr>
                    <td class="info-label">RIB</td>
                    <td class="info-value mono">{{ $account->rib ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <td class="info-label">Date d'ouverture</td>
                    <td class="info-value">{{ $creationDate }}</td>
                </tr>
                @if($account->pack)
                <tr>
                    <td class="info-label">Pack / Offre</td>
                    <td class="info-value gold">{{ $account->pack->name }}</td>
                </tr>
                @endif
            </table>
        </div>

        <!-- Section 2: Informations du Client -->
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
                    <td class="info-label">Date de naissance</td>
                    <td class="info-value">{{ $client->date_naissance ? \Carbon\Carbon::parse($client->date_naissance)->format('d/m/Y') : 'Non renseignée' }}</td>
                </tr>
                <tr>
                    <td class="info-label">Téléphone</td>
                    <td class="info-value">{{ $client->phone ?? 'Non renseigné' }}</td>
                </tr>
                <tr>
                    <td class="info-label">Email</td>
                    <td class="info-value">{{ $client->email ?? 'Non renseigné' }}</td>
                </tr>
                <tr>
                    <td class="info-label">Adresse</td>
                    <td class="info-value">{{ $client->adresse ?? 'Non renseignée' }}</td>
                </tr>
                <tr>
                    <td class="info-label">N° Client</td>
                    <td class="info-value gold">{{ $client->client_number ?? 'N/A' }}</td>
                </tr>
            </table>
        </div>

        <!-- Section 3: Informations de l'Agence -->
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
                    <td class="info-label">Ville / Région</td>
                    <td class="info-value">{{ $agenceVille }} — Maroc</td>
                </tr>
            </table>
        </div>

        <!-- SIGNATURE -->
        <div class="signature-section">
            <table class="sig-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="sig-box">
                        <div class="sig-title">Cachet et Signature de l'Agence</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
        <table class="footer-table" cellpadding="0" cellspacing="0">
            <tr>
                <td class="footer-left">
                    <strong>Client Service : 160</strong><br>
                    www.albaridbank.ma
                </td>
                <td class="footer-right">
                    <div class="footer-brand">AL BARID BANK</div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
