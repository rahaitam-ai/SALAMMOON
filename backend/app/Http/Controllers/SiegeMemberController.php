<?php

namespace App\Http\Controllers;

use App\Models\SiegeMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SiegeMemberController extends Controller
{
    /**
     * Show the form for creating a new member.
     */
    public function create()
    {
        // Get the next auto-increment ID
        $statement = DB::select("SHOW TABLE STATUS LIKE 'siege_members'");
        $nextId = $statement[0]->Auto_increment ?? 1;

        return view('siege_members.create', compact('nextId'));
    }

    /**
     * Store a newly created member in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:siege_members,email',
        ], [
            'nom.required' => 'Le champ Nom est obligatoire.',
            'prenom.required' => 'Le champ Prénom est obligatoire.',
            'email.required' => 'L\'email est obligatoire.',
            'email.unique' => 'Cet email est déjà utilisé.',
        ]);

        SiegeMember::create($request->all());

        return redirect()->back()->with('success', 'Membre ajouté avec succès !');
    }
}
