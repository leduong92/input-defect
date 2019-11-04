using System.ComponentModel.DataAnnotations;

namespace VNNSIS.ViewModels {
    public class ErrorListViewModel {
        // public string job_order_no { get; set; }
        // public string finished_goods_code { get; set; }
        
        public string operation_code { get; set; }
        public string operation_name { get; set; }
        [Key]
        public string error_name {get; set;}
        public string error_id {get; set;}
        public string start_date { get; set; }
        public string end_date { get; set; }
        public string machine_no { get; set; }
        public int operation_sequence { get; set; }
        public string error_name_en { get; set; }
        public string error_name_jp { get; set; }
        public string department { get; set; }
        public string area { get; set; }
        public string program_id { get; set; }
    }
}