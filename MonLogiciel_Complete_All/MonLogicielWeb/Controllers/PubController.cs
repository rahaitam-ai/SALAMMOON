using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
namespace MonLogicielWeb.Controllers
{
    [ApiController]
    [Route("api/pub")]
    public class PubController : ControllerBase
    {
        private static List<PubItem> items = new();
        [HttpGet] public ActionResult<List<PubItem>> Get() => items;
        [HttpPost] public ActionResult<PubItem> Create(PubItem item){ item.Id = items.Count==0?1:items.Max(i=>i.Id)+1; items.Add(item); return item; }
        [HttpDelete("{id}")] public ActionResult Delete(int id){ items.RemoveAll(i=>i.Id==id); return Ok(); }
    }
    public class PubItem{ public int Id{get;set;} public string Name{get;set;} public string Text{get;set;} public string ImageUrl{get;set;} }
}
