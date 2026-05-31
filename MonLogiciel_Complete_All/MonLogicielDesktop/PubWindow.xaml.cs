using Microsoft.Data.Sqlite;
using System.Collections.ObjectModel;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace MonLogicielDesktop
{
    public partial class PubWindow : Window
    {
        private string dbPath = Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData),"MonLogicielDesktop","pub.db");
        private ObservableCollection<Panneau> panneaux = new ObservableCollection<Panneau>();
        public PubWindow() { InitializeComponent(); Directory.CreateDirectory(Path.GetDirectoryName(dbPath)); InitDb(); LoadPanneaux(); lstPanneaux.ItemsSource = panneaux; }
        private void InitDb() { using var conn = new SqliteConnection($\"Data Source={dbPath}\"); conn.Open(); using var cmd = conn.CreateCommand(); cmd.CommandText = \"CREATE TABLE IF NOT EXISTS Panneaux(Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Text TEXT, ImagePath TEXT);\"; cmd.ExecuteNonQuery(); }
        private void LoadPanneaux() { panneaux.Clear(); using var conn = new SqliteConnection($\"Data Source={dbPath}\"); conn.Open(); using var cmd = conn.CreateCommand(); cmd.CommandText = \"SELECT Id, Name, Text, ImagePath FROM Panneaux ORDER BY Id DESC;\"; using var rdr = cmd.ExecuteReader(); while(rdr.Read()) panneaux.Add(new Panneau{ Id=rdr.GetInt32(0), Name=rdr.GetString(1), Text=rdr.GetString(2), ImagePath = rdr.IsDBNull(3)?null:rdr.GetString(3) }); }
        private void btnLoadImage_Click(object sender, RoutedEventArgs e) { var ofd = new Microsoft.Win32.OpenFileDialog{ Filter = \"Images|.png;.jpg;.jpeg;.bmp\" }; if(ofd.ShowDialog()==true){ previewImage.Source = new BitmapImage(new System.Uri(ofd.FileName)); previewImage.Tag = ofd.FileName; } }
        private void btnAdd_Click(object sender, RoutedEventArgs e) { var name = txtName.Text?.Trim(); var text = txtText.Text?.Trim(); var img = previewImage.Tag as string ?? \"\"; if(string.IsNullOrEmpty(name)){ MessageBox.Show(\"Nom requis\"); return; } using var conn = new SqliteConnection($\"Data Source={dbPath}\"); conn.Open(); using var cmd = conn.CreateCommand(); cmd.CommandText = \"INSERT INTO Panneaux(Name, Text, ImagePath) VALUES($n,$t,$p);\"; cmd.Parameters.AddWithValue(\"$n\", name); cmd.Parameters.AddWithValue(\"$t\", text ?? \"\"); cmd.Parameters.AddWithValue(\"$p\", img); cmd.ExecuteNonQuery(); txtName.Text=\"\"; txtText.Text=\"\"; previewImage.Source=null; previewImage.Tag=null; LoadPanneaux(); }
        private void lstPanneaux_SelectionChanged(object sender, SelectionChangedEventArgs e) { if(lstPanneaux.SelectedItem is Panneau p) { previewCanvas.Children.Clear(); var tb = new TextBlock{ Text = p.Text, Foreground = Brushes.White, FontSize=24, Width=previewCanvas.ActualWidth-40, TextWrapping=TextWrapping.Wrap }; System.Windows.Controls.Canvas.SetLeft(tb,20); System.Windows.Controls.Canvas.SetTop(tb, previewCanvas.ActualHeight*0.1); previewCanvas.Children.Add(tb); if(!string.IsNullOrEmpty(p.ImagePath) && File.Exists(p.ImagePath)){ var img = new System.Windows.Controls.Image{ Source = new BitmapImage(new System.Uri(p.ImagePath)), Width = previewCanvas.ActualWidth*0.6, Height = previewCanvas.ActualHeight*0.6 }; System.Windows.Controls.Canvas.SetLeft(img,20); System.Windows.Controls.Canvas.SetTop(img,20); previewCanvas.Children.Add(img); } } }
        private void btnExport_Click(object sender, RoutedEventArgs e) { var dlg = new Microsoft.Win32.SaveFileDialog{ Filter=\"PNG Image|*.png\", FileName=\"panneau.png\" }; if(dlg.ShowDialog()==true){ var rtb = new RenderTargetBitmap((int)previewCanvas.ActualWidth, (int)previewCanvas.ActualHeight, 96,96, PixelFormats.Pbgra32); rtb.Render(previewCanvas); var encoder = new PngBitmapEncoder(); encoder.Frames.Add(BitmapFrame.Create(rtb)); using var fs = new FileStream(dlg.FileName, FileMode.Create); encoder.Save(fs); MessageBox.Show(\"Exporté: \" + dlg.FileName); } }
    }
    public class Panneau { public int Id{get;set;} public string Name{get;set;} public string Text{get;set;} public string ImagePath{get;set;} public override string ToString()=>Name; }
}
