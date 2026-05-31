using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Windows;
using System.Windows.Shapes;
using System.Windows.Media;

namespace MonLogicielDesktop
{
    public partial class CuisineWindow : Window
    {
        private string dbPath = Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData),"MonLogicielDesktop","cuisine.db");
        private List<Meuble> meubles = new List<Meuble>();
        public CuisineWindow() { InitializeComponent(); Directory.CreateDirectory(Path.GetDirectoryName(dbPath)); InitDb(); LoadMeubles(); Redraw(); }
        private void InitDb() { using var conn = new SqliteConnection($\"Data Source={dbPath}\"); conn.Open(); using var cmd = conn.CreateCommand(); cmd.CommandText = \"CREATE TABLE IF NOT EXISTS Meubles(Id INTEGER PRIMARY KEY AUTOINCREMENT, Data TEXT);\"; cmd.ExecuteNonQuery(); }
        private void SaveMeublesToDb() { var json = JsonSerializer.Serialize(meubles); using var conn = new SqliteConnection($\"Data Source={dbPath}\"); conn.Open(); using var cmd = conn.CreateCommand(); cmd.CommandText = \"DELETE FROM Meubles; INSERT INTO Meubles(Data) VALUES($d);\"; cmd.Parameters.AddWithValue(\"$d\", json); cmd.ExecuteNonQuery(); }
        private void LoadMeubles() { meubles.Clear(); using var conn = new SqliteConnection($\"Data Source={dbPath}\"); conn.Open(); using var cmd = conn.CreateCommand(); cmd.CommandText = \"SELECT Data FROM Meubles LIMIT 1;\"; using var rdr = cmd.ExecuteReader(); if(rdr.Read() && !rdr.IsDBNull(0)){ var json = rdr.GetString(0); meubles = JsonSerializer.Deserialize<List<Meuble>>(json) ?? new List<Meuble>(); } }
        private void Redraw() { canvasRoom.Children.Clear(); foreach(var m in meubles){ var rect = new Rectangle{ Width = m.Width, Height = m.Height, Fill = new SolidColorBrush(Color.FromRgb(80,80,90)), Stroke=Brushes.White }; Canvas.SetLeft(rect, m.X); Canvas.SetTop(rect, m.Y); canvasRoom.Children.Add(rect); } }
        private void btnAddMeuble_Click(object sender, RoutedEventArgs e) { var m = new Meuble{ Id = meubles.Count+1, X=20+meubles.Count*10, Y=20+meubles.Count*8, Width=120, Height=60 }; meubles.Add(m); Redraw(); }
        private void btnSave_Click(object sender, RoutedEventArgs e) { SaveMeublesToDb(); MessageBox.Show("Sauvegardé"); }
        private void btnLoad_Click(object sender, RoutedEventArgs e) { LoadMeubles(); Redraw(); MessageBox.Show("Chargé"); }
    }
    public class Meuble { public int Id{get;set;} public double X{get;set;} public double Y{get;set;} public double Width{get;set;} public double Height{get;set;} }
}
