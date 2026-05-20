<?php

namespace App\Services;

use App\Models\Account;
use Carbon\Carbon;

class AccountNumberService
{
    /**
     * Generate a unique account number following the exact format:
     * MM + 00 + JJJ + XXX + CODE_AGENCE + YY
     * 
     * MM: Month (2 digits)
     * 00: Fixed
     * JJJ: Day of year (3 digits)
     * XXX: Daily incremental ID per agency (3 digits)
     * CODE_AGENCE: Raw agency code
     * YY: Year (2 digits)
     * 
     * @param string $agencyCode
     * @param int $agenceId
     * @return string
     */
    public function generate(string $agencyCode, int $agenceId): string
    {
        $date = Carbon::now();
        
        $mm = $date->format('m');
        $fixed = "00";
        $jjj = str_pad($date->dayOfYear, 3, '0', STR_PAD_LEFT);
        $yy = $date->format('y');
        
        // Find the count of accounts created TODAY in THIS AGENCY to determine XXX
        $lastAccount = Account::whereHas('client', function($query) use ($agenceId) {
                $query->where('agence_id', $agenceId);
            })
            ->whereDate('created_at', Carbon::today())
            ->whereNotNull('numero_compte')
            ->orderBy('id', 'desc')
            ->first();

        if ($lastAccount && $lastAccount->numero_compte) {
            // The XXX starts at index 7 and has length 3
            // Format: MM(2) 00(2) JJJ(3) -> 7 chars before XXX
            $lastXxx = substr($lastAccount->numero_compte, 7, 3);
            $nextXxxInt = (int)$lastXxx + 1;
            $xxx = str_pad((string)$nextXxxInt, 3, '0', STR_PAD_LEFT);
        } else {
            $xxx = '001';
        }

        return $mm . $fixed . $jjj . $xxx . $agencyCode . $yy;
    }
}
