
using System.Collections.Generic;
using VNNSIS.Models;

namespace VNNSIS.Interface
{
    public interface IMenuMasterRepository : IRepository<MenuMasterModel>
    {
        IEnumerable<MenuMasterModel> GetMenuMaster();
        IEnumerable<MenuMasterModel> GetMenuMaster(string UserRole);

    }
}