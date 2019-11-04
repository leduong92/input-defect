using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using VNNSIS.Common;
using VNNSIS.Data;
using VNNSIS.Interface;
using VNNSIS.Models;
using VNNSIS.Repositories;
using Microsoft.AspNetCore.Http;

namespace VNNSIS.Controllers
{
    public class HomeController : Controller
    {
        private readonly UnitOfWork uow;  
        public HomeController( SqlDbContext sqlDbContext, PostgreDbContext postGreDbContext)
        {             
            uow = new UnitOfWork(sqlDbContext, postGreDbContext);
        }

        public IActionResult Index()
        {
            //khi redirect từ trang InputDefect thì xóa session
            HttpContext.Session.Remove(CommonConstants.USER_SEESION);
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public JsonResult CheckUser(string UserRole, string UserId)
        { 
            string userID = UserId.Replace("*","").Trim();
            string userRole = uow.Accounts.GetUserRole(userID);
            string roleName = uow.Accounts.GetRoleName(userRole);  

            if(roleName.Trim() == UserRole.ToString().Trim())
            {
                HttpContext.Session.SetString(CommonConstants.USER_SEESION, userID);
                return Json("OK");    
            }
            else
            {
                return Json("không có quyền");     
            }         

        }
    }
}
