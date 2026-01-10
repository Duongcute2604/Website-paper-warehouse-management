using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using QLY_LMS.Modal;
using System.Collections.Generic;
using QLY_LMS.BLL.Admin_BLL.BLL_Interfaces;
using ADMIN.DAL.Implementations;

[Route("api/[controller]")]
[ApiController]
public class Admin : ControllerBase
{
    private readonly IUserBLL _User; 
    public Admin(IUserBLL User)
    {
        _User =  User;
    }

    [Route("get-all-user")]
    [HttpGet]
    public ActionResult<UserDAL> GetAll()
    {
        var users = _User.GetAllUsers();
        return Ok(users);
    }


    [Route("get-by-id/{id}")]
    [HttpGet]
    public User_table GetByID(int id)
    {
        var user = _User.GetUserById(id);
        return _User.GetUserById(id);
        
    }

    [Route("create-new-user")]
    [HttpPost]
    public IActionResult Create(User_table model)
    {
        var user = _User.CreateUser(model);
        return Ok(user);
    }

    [Route("update-user")]
    [HttpPost]
    public ActionResult<UserDAL> Update(User_table model)
    {
        var user = _User.UpdateUser(model);
        return Ok(user);
    }

    [Route("delete-user")]
    [HttpPost]
    public IActionResult Delete(int id)
    {

        bool result = _User.DeleteUser(id);
        return result
            ? Ok("Xóa thành công")
            : BadRequest("Xóa thất bại");
    }
    //[HttpPost]
    //public ActionResult<UserDAL> Create(string name, string district, string province, DateTime dateOfbirth, string phoneNumber, string Email, string Account, string Pass, int role)
    //{
    //    var user = _repo.CreateUser(name, district, province, dateOfbirth, phoneNumber, Email, Account, Pass, role);
    //    return Ok(user);
    //}
}                                        
                                         

