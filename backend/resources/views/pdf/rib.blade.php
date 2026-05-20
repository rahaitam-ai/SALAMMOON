<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Relevé d'Identité Bancaire - {{ $client->nom }} {{ $client->prenom }}</title>
    <style>
        @page { margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            color: #0F1929;
            background: #ffffff;
            font-size: 12px;
            line-height: 1.4;
        }

        /* ── HEADER ── */
        .header {
            padding: 30px 45px 25px;
            border-bottom: 4px solid #d4a017;
            background: #fafafa;
        }
        .header-table { width: 100%; }
        .header-left { width: 45%; vertical-align: middle; }
        .header-right { width: 55%; vertical-align: middle; text-align: right; }
        .logo-img {
            height: 110px;
            width: auto;
        }
        .title-fr {
            font-size: 18px;
            font-weight: bold;
            color: #0F1929;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .header-meta {
            font-size: 11px;
            color: #777;
            margin-top: 6px;
        }

        /* ── CERTIFICATION ── */
        .certification {
            padding: 16px 45px;
            font-size: 11px;
            color: #5A6B82;
            line-height: 1.6;
            border-bottom: 1px solid #E4DDD1;
            background: #fdfbf8;
        }
        .certification strong { color: #0F1929; }

        /* ── CONTENT ── */
        .content { padding: 30px 45px; }

        /* ── SECTION BOX ── */
        .section-box {
            border: 1px solid #E4DDD1;
            border-left: 4px solid #d4a017;
            border-radius: 8px;
            margin-bottom: 22px;
            background: #ffffff;
            overflow: hidden;
        }
        .section-header {
            padding: 12px 18px;
            border-bottom: 1px solid #E4DDD1;
            background: #F7F4EE;
        }
        .section-title-fr {
            font-size: 13px;
            font-weight: bold;
            color: #0F1929;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* ── INFO TABLE ── */
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 10px 18px;
            border-bottom: 1px solid #EDE8DF;
            vertical-align: middle;
        }
        .info-table tr:last-child td { border-bottom: none; }
        .info-label {
            width: 35%;
            font-weight: bold;
            color: #5A6B82;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-value {
            width: 65%;
            color: #0F1929;
            font-weight: bold;
            font-size: 12px;
        }
        .mono {
            font-family: 'Courier New', monospace;
            font-size: 13px;
            letter-spacing: 1.5px;
            color: #0F1929;
            background: #F7F4EE;
            padding: 6px 12px;
            border-radius: 4px;
            display: inline-block;
            border: 1px solid #E4DDD1;
            font-weight: bold;
        }
        .gold { color: #d4a017; }

        /* ── SIGNATURE ── */
        .signature-section {
            margin-top: 30px;
            width: 100%;
        }
        .sig-table { width: 100%; border-collapse: collapse; }
        .sig-box {
            width: 45%;
            border: 1px dashed #d4a017;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            vertical-align: top;
            height: 100px;
            background: #fafafa;
        }
        .sig-title {
            font-size: 11px;
            font-weight: bold;
            color: #0F1929;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* ── FOOTER ── */
        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 15px 45px;
            border-top: 3px solid #d4a017;
            background: #F7F4EE;
        }
        .footer-table { width: 100%; }
        .footer-left {
            font-size: 10px;
            color: #5A6B82;
            vertical-align: middle;
        }
        .footer-left strong { color: #0F1929; }
        .footer-right {
            text-align: right;
            vertical-align: middle;
        }
        .footer-brand {
            font-size: 12px;
            font-weight: bold;
            color: #0F1929;
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
                    @if(file_exists(public_path('images/al-barid-bank.jpg')))
                        <img src="{{ public_path('images/al-barid-bank.jpg') }}" class="logo-img" alt="Al Barid Bank">
                    @else
                        <span style="font-size: 20px; font-weight: bold; color: #0F1929;">AL BARID BANK</span>
                    @endif
                </td>
                <td class="header-right">
                    <div class="title-fr">RELEVÉ D'IDENTITÉ BANCAIRE</div>
                    <div class="header-meta">
                        Date d'édition : <strong>{{ date('d/m/Y') }}</strong>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- CERTIFICATION -->
    <div class="certification">
        AL BARID BANK certifie que les informations d'identité bancaire ci-dessous concernent le compte ouvert dans ses livres au nom du titulaire désigné.
    </div>

    <!-- CONTENT -->
    <div class="content">

        <!-- Section 1: Informations Client -->
        <div class="section-box">
            <div class="section-header">
                <div class="section-title-fr">INFORMATIONS CLIENT</div>
            </div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Nom</td>
                    <td class="info-value">{{ strtoupper($client->nom) }}</td>
                </tr>
                <tr>
                    <td class="info-label">Prénom</td>
                    <td class="info-value">{{ $client->prenom }}</td>
                </tr>
                <tr>
                    <td class= "info-label" >CIN / Passport</td>
                    <td class= "info-value" >{{ $client->cin }}</td>
                </tr>
                <tr>
                    <td class="info-label">Numéro Client</td>
                    <td class="info-value gold">{{ $client->client_number ?? 'N/A' }}</td>
                </tr>
            </table>
        </div>

        <!-- Section 2: Informations Bancaires -->
        <div class="section-box">
            <div class="section-header">
                <div class="section-title-fr">INFORMATIONS BANCAIRES</div>
            </div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Numéro de Compte</td>
                    <td class="info-value" style="font-weight: bold !important; font-size: 14px;">{{ $account->numero_compte }}</td>
                </tr>
                <tr>
                    <td class="info-label">  <strong>  RIB   </strong>   </td>
                    <td class="info-value">
                        <span class="info-value" style="font-weight: bold !important; font-size: 14px;">{{ $account->rib ?? 'N/A' }}</span>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Section 3: Informations Agence -->
        <div class="section-box">
            <div class="section-header">
                <div class="section-title-fr">INFORMATIONS AGENCE</div>
            </div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Nom Agence</td>
                    <td class="info-value">{{ $agenceName }}</td>
                </tr>
                <tr>
                    <td class="info-label">Ville / Région</td>
                    <td class="info-value">{{ $agenceVille }}</td>
                </tr>
                <tr>
                    <td class="info-label">Code Agence</td>
                    <td class="info-value">{{ $agenceCode }}</td>
                </tr>
            </table>
        </div>

        <!-- SIGNATURE -->
        <div class="signature-section">
            <table class="sig-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="sig-box">
                        <div class="sig-title">Cachet de la Banque</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
        <table class="footer-table" cellpadding="0" cellspacing="0">
            <tr>
               
                <td class="footer-right">
                    <div class="footer-brand">AL BARID BANK</div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
