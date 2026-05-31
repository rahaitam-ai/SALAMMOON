<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reçu de Dépôt - {{ $depot->reference_operation }}</title>
    <style>
        @page { margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            color: #0F1929;
            background: #ffffff;
            font-size: 11px;
            line-height: 1.4;
        }

        .header {
            padding: 25px 45px 20px;
            border-bottom: 4px solid #d4a017;
            background: #fafafa;
        }
        .header-table { width: 100%; }
        .header-left { width: 45%; vertical-align: middle; }
        .header-right { width: 55%; vertical-align: middle; text-align: right; }
        .logo-img {
            height: 90px;
            width: auto;
        }
        .title-fr {
            font-size: 16px;
            font-weight: bold;
            color: #0F1929;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .header-meta { font-size: 10px; color: #777; margin-top: 6px; }

        .certification {
            padding: 12px 45px;
            font-size: 10px;
            color: #5A6B82;
            line-height: 1.5;
            border-bottom: 1px solid #E4DDD1;
            background: #fdfbf8;
            text-align: center;
        }
        .certification strong { color: #0F1929; }

        .content { padding: 25px 45px; }

        .section-box {
            border: 1px solid #E4DDD1;
            border-left: 4px solid #d4a017;
            border-radius: 8px;
            margin-bottom: 18px;
            background: #ffffff;
            overflow: hidden;
        }
        .section-header {
            padding: 10px 15px;
            border-bottom: 1px solid #E4DDD1;
            background: #F7F4EE;
        }
        .section-title-fr {
            font-size: 11px;
            font-weight: bold;
            color: #0F1929;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-table { width: 100%; border-collapse: collapse; }
        .info-table td {
            padding: 8px 15px;
            border-bottom: 1px solid #EDE8DF;
            vertical-align: middle;
        }
        .info-table tr:last-child td { border-bottom: none; }
        .info-label {
            width: 35%;
            font-weight: bold;
            color: #5A6B82;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-value {
            width: 65%;
            color: #0F1929;
            font-weight: bold;
            font-size: 11px;
        }
        .mono {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            letter-spacing: 1px;
            color: #0F1929;
            background: #F7F4EE;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
            border: 1px solid #E4DDD1;
            font-weight: bold;
        }
        .gold { color: #d4a017; }

        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 20px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-success { background-color: #d1fae5; color: #065f46; }

        .signature-section { margin-top: 25px; width: 100%; }
        .sig-table { width: 100%; border-collapse: collapse; }
        .sig-box {
            width: 50%;
            border: 1px dashed #d4a017;
            border-radius: 8px;
            padding: 12px;
            text-align: center;
            vertical-align: top;
            height: 90px;
            background: #fafafa;
        }
        .sig-title { font-size: 10px; font-weight: bold; color: #0F1929; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .sig-value { font-size: 11px; font-style: italic; color: #555; margin-top: 20px; }

        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 12px 45px;
            border-top: 3px solid #d4a017;
            background: #F7F4EE;
        }
        .footer-table { width: 100%; }
        .footer-left { font-size: 9px; color: #5A6B82; vertical-align: middle; }
        .footer-left strong { color: #0F1929; }
        .footer-right { text-align: right; vertical-align: middle; }
        .footer-brand { font-size: 11px; font-weight: bold; color: #0F1929; letter-spacing: 1px; }
    </style>
</head>
<body>
    <div class="header">
        <table class="header-table" cellpadding="0" cellspacing="0">
            <tr>
                <td class="header-left">
                    @if(file_exists(public_path('images/al-barid-bank.jpg')))
                        <img src="{{ public_path('images/al-barid-bank.jpg') }}" class="logo-img" alt="Al Barid Bank">
                    @else
                        <span style="font-size: 18px; font-weight: bold; color: #0F1929;">AL BARID BANK</span>
                    @endif
                </td>
                <td class="header-right">
                    <div class="title-fr">REÇU DE DÉPÔT D'ARGENT</div>
                    <div class="header-meta">
                        Référence : <strong class="mono gold">{{ $depot->reference_operation }}</strong><br>
                        Date de dépôt : <strong>{{ $date_depot }} à {{ $heure_depot }}</strong>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="certification">
        AL BARID BANK certifie par la présente avoir reçu les fonds mentionnés ci-dessous pour versement sur le compte désigné.
    </div>

    <div class="content">
        <div class="section-box">
            <div class="section-header">
                <div class="section-title-fr">INFORMATIONS DÉPOSANT</div>
            </div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Nom & Prénom</td>
                    <td class="info-value">{{ strtoupper($depot->nom) }} {{ $depot->prenom }}</td>
                </tr>
                <tr>
                    <td class="info-label">CIN / Passport</td>
                    <td class="info-value">{{ strtoupper($depot->cin) }}</td>
                </tr>
                @if($depot->date_expiration_cin)
                <tr>
                    <td class="info-label">Expiration CIN</td>
                    <td class="info-value">{{ \Carbon\Carbon::parse($depot->date_expiration_cin)->format('d/m/Y') }}</td>
                </tr>
                @endif
            </table>
        </div>

        <div class="section-box">
            <div class="section-header">
                <div class="section-title-fr">COMPTE BÉNÉFICIAIRE</div>
            </div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Titulaire du Compte</td>
                    <td class="info-value">{{ strtoupper($client->nom ?? '') }} {{ $client->prenom ?? '' }}</td>
                </tr>
                <tr>
                    <td class="info-label">Numéro de Compte</td>
                    <td class="info-value">{{ $depot->numero_compte }}</td>
                </tr>
                @if($depot->rib)
                <tr>
                    <td class="info-label">RIB</td>
                    <td class="info-value"><span class="mono">{{ $depot->rib }}</span></td>
                </tr>
                @endif
                <tr>
                    <td class="info-label">Type & Statut</td>
                    <td class="info-value">
                        {{ $account->type->name ?? 'Compte Bancaire' }} ·
                        <span class="badge badge-success">Actif</span>
                    </td>
                </tr>
            </table>
        </div>

        <div class="section-box">
            <div class="section-header">
                <div class="section-title-fr">DÉTAILS DU VERSEMENT</div>
            </div>
            <table class="info-table">
                <tr>
                    <td class="info-label">Type de dépôt</td>
                    <td class="info-value" style="text-transform: uppercase; color: #d4a017;">
                        {{ $depot->type_depot === 'especes' ? '💸 Espèces' : '🧾 Chèque' }}
                    </td>
                </tr>
                <tr>
                    <td class="info-label" style="font-size: 11px; color: #0F1929;">Montant versé</td>
                    <td class="info-value" style="font-size: 14px; color: #065f46;">
                        + {{ number_format($depot->montant, 2, ',', ' ') }} MAD
                    </td>
                </tr>
            </table>
        </div>

        <div class="signature-section">
            <table class="sig-table" cellpadding="0" cellspacing="0">
                <tr>
                    <td class="sig-box" style="border-right: none; border-top-right-radius: 0; border-bottom-right-radius: 0;">
                        <div class="sig-title">Cachet de la Banque</div>
                        <div style="margin-top: 10px; color: #d4a017; font-weight: bold; font-size: 12px; border: 2px solid #d4a017; border-radius: 50%; width: 55px; height: 55px; line-height: 50px; display: inline-block; transform: rotate(-15deg); opacity: 0.8;">
                            PAYÉ
                        </div>
                    </td>
                    <td class="sig-box" style="border-top-left-radius: 0; border-bottom-left-radius: 0;">
                        <div class="sig-title">Signature</div>
                        <div class="sig-value">&nbsp;</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <div class="footer">
        <table class="footer-table" cellpadding="0" cellspacing="0">
            <tr>
                <td class="footer-left">
                    Al Barid Bank - Société Anonyme au Capital de 800.000.000 DH.<br>
                    Siège social : Rabat, Maroc. Document généré électroniquement.
                </td>
                <td class="footer-right">
                    <div class="footer-brand">AL BARID BANK</div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
