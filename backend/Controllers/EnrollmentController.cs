using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotiveBackend.Data;
using MotiveBackend.Models;
using MotiveBackend.DTOs;

namespace MotiveBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentController : ControllerBase
    {
        private readonly Ecen424DbProjectContext _context;
        public EnrollmentController(Ecen424DbProjectContext context)
        {
            _context = context;
        }


    }
}
