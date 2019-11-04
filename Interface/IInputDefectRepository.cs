
using System.Collections.Generic;
using VNNSIS.Models;
using VNNSIS.ViewModels;
using System.Threading.Tasks;
using System.Data;
using System.Linq;

namespace VNNSIS.Interface
{
    public interface IInputDefectRepository 
    {
        Task<IEnumerable<InformationDataViewModel>> GetDataByJobNo(string jobOrderNo);
        Task<TrCurJobNbcs> FindJob(string jobOrderNo);

        Task<IEnumerable<ErrorListViewModel>> GetDataByOperationCode(string jobOrderNo, string operationCode);
        // Task<IEnumerable<ErrorListModel>> GetErrorList();

        int SaveAsync(string values); 
        Task<IEnumerable<OperationNumberViewModel>> GetOperationNumber(string jobOrderNo, string operationCode); 
    }
}