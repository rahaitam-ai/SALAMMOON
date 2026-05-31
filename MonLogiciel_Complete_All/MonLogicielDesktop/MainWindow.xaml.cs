using System.Windows;
namespace MonLogicielDesktop
{
    public partial class MainWindow : Window
    {
        public MainWindow() { InitializeComponent(); }
        private void OpenPub_Click(object sender, RoutedEventArgs e) => new PubWindow(){ Owner=this }.ShowDialog();
        private void OpenCuisine_Click(object sender, RoutedEventArgs e) => new CuisineWindow(){ Owner=this }.ShowDialog();
        private void MenuQuit_Click(object sender, RoutedEventArgs e) => Close();
    }
}
