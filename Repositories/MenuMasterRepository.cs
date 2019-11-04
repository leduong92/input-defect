
using System.Collections.Generic;
using System.Linq;
using VNNSIS.Data;
using VNNSIS.Models;
using VNNSIS.Interface;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace VNNSIS.Repositories
{
    public class MenuMasterRepository : Repository<MenuMasterModel>,IMenuMasterRepository
    {
        private readonly SqlDbContext _sqlDbContext;
        public MenuMasterRepository(SqlDbContext sqlDbContext) : base(sqlDbContext)
        {
            _sqlDbContext = sqlDbContext;
        }
        public IEnumerable<MenuMasterModel> GetMenuMaster()
        {
            return _sqlDbContext.MenuMaster.AsEnumerable();
        }
        public IEnumerable<MenuMasterModel> GetMenuMaster(string UserRole)
        {
            var result = _sqlDbContext.MenuMaster.Where(m => m.UserRole == UserRole).ToList();  
			return result;
        }
    }
}