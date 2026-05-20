<?php

namespace App\Services;

use App\Models\Client;
use Carbon\Carbon;

class ClientNumberService
{
    /**
     * Generate a unique client number following the exact format:
     * YY + 00 + JJJ + XXX + CODE_AGENCE + MM
     * 
     * YY: Year (2 digits)
     * 00: Fixed
     * JJJ: Day of year (3 digits)
     * XXX: Daily incremental ID per agency (3 digits)
     * CODE_AGENCE: Raw agency code
     * MM: Month (2 digits)
     * 
     * @param string $agencyCode
     * @param int $agenceId
     * @return string
     */
    public function generate(string $agencyCode, int $agenceId): string
    {
        $date = Carbon::now();
        
        $yy = $date->format('y');
        $fixed = "00";
        $jjj = str_pad($date->dayOfYear, 3, '0', STR_PAD_LEFT);
        $mm = $date->format('m');
        
        // Prefix: YY + 00 + JJJ
        $prefix = $yy . $fixed . $jjj;

        // Find the count of clients created TODAY in THIS AGENCY to determine XXX
        // We look for the maximum XXX used today for this specific agency
        // Format: {prefix}{XXX}{agencyCode}{mm}
        
        $lastClient = Client::where('agence_id', $agenceId)
            ->whereDate('created_at', Carbon::today())
            ->whereNotNull('client_number')
            ->orderBy('id', 'desc')
            ->first();

        if ($lastClient && $lastClient->client_number) {
            // The XXX starts at index 7 and has length 3
            // Format: YY(2) 00(2) JJJ(3) -> 7 chars before XXX
            $lastXxx = substr($lastClient->client_number, 7, 3);
            $nextXxxInt = (int)$lastXxx + 1;
            $xxx = str_pad((string)$nextXxxInt, 3, '0', STR_PAD_LEFT);
        } else {
            $xxx = '001';
        }

        return $prefix . $xxx . $agencyCode . $mm;
    }
}
