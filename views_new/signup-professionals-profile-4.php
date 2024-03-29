<!DOCTYPE html>
<html lang="en">

<head>
  <title>Relai</title>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <!-- Style CSS -->
  <link rel="stylesheet" type="text/css" href="style.css">
  <!-- fonts CSS -->
  <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <!-- Animate CSS -->
</head>

<body>
  <!-- The Modal -->
  <div class="modal permission-modal fade " id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header text-center">
          <h2 class="modal-title w-100">Add Employment</h2>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <input type="text" class="form-control form-control-fix2" id="subject" placeholder=" Name of Employer"
            name="employName">

          <input type="text" class="form-control form-control-fix2" id="subject" placeholder=" Job Title"
            name="jobTitle">

          <input type="text" class="form-control form-control-fix2" id="subject" placeholder="Job Description"
            name="jobdesc">

          <input type="text" class="form-control form-control-fix2" id="subject" placeholder=" Reason for Leaving"
            name="reason">

          <div class="row">
            <div class="col-sm-12 col-lg-6">
              <input type="date" class="form-control  form-control-fix2" id="subject" placeholder="from Date"
                name="fromDate">
            </div>
            <div class="col-sm-12 col-lg-6">
              <input type="date" class="form-control  form-control-fix2" id="subject" placeholder="toDate"
                name="toDate">
            </div>
          </div>
          <div class="model-btn-fix">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-cancel" data-dismiss="modal">Save</button>
        </div>
      </div>
    </div>
  </div>



  <div class="wrapper dashboard">
    <nav class="navbar navbar-expand-lg d-block d-xs-none d-lg-none">
      <a class="navbar-brand" href="index.html"><img src="images/logo-2.png"></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
        <i class="fa fa-bars" aria-hidden="true"></i>
      </button>
      <div class="user-right">
        <ul class="login-menu">
          <li class="dropdown"><a href="#" class="dropdown-toggle" type="button" id="dropdownMenuButton"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="images/recent-user-1.png"
                width="40" height="40" class="rounded-circle"> John <i class="fa fa-angle-down"
                aria-hidden="true"></i></a>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a class="dropdown-item" href="#">Setting</a>
              <a class="dropdown-item" href="#">Account</a>
              <a class="dropdown-item" href="#">Log Out</a>
            </div>
          </li>
        </ul>
      </div>
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="dashboard.html"><img class="act-img" src="images/dashboard-active.png"><img
                src="images/dashboard.png"> Dashboard</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="track-your-progress.html"><img class="act-img" src="images/track-active.png"><img
                src="images/track.png"> Track your progress</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="professionals.html"><img class="act-img" src="images/dreamhome-active.png"><img
                src="images/dreamhome.png"> Properties</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="mydreamhome-details-docs.html"><img class="act-img"
                src="images/complaints-active.png"><img src="images/complaints.png"> Complaints</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="professionals-to-do-list.html"><img class="act-img"
                src="images/to-do-list-active.png"><img src="images/to-do-list.png"> To do list</a>
          </li>
        </ul>
      </div>
    </nav>





    <div class="dashboard-wpr">
      <div class="container-fluid">
        <div class="row content">
          <div class="col-sm-3 sidenav2 hidden-xs-down">
            <div class=" text-center">
              <div class="">
                <a href="index.html"><img src="images/logo-2.png"></a>
              </div>

            </div>
            <ul class="dashboard-nav">
              <li class="completed">
                <a href="signup-professionals-profile.html">
                  <img class="complete-img" src="images/checked.png">
                  <img class="act-img" src="images/1-active.png">
                  <img src="images/1.png">
                  PERSONAL DETAILS
                </a>
              </li>
              <li class="completed">
                <a href="signup-professionals-profile-2.html">
                  <img class="complete-img" src="images/checked.png">
                  <img class="act-img" src="images/2-active.png">
                  <img src="images/2.png"> OTHER DETAILS</a>
              </li>
              <li class="completed">
                <a href="signup-professionals-profile-3.html">
                  <img class="complete-img" src="images/checked.png">
                  <img class="act-img" src="images/3-active.png">
                  <img src="images/3.png"> EDUCATION</a>
              </li>
              <li class="active">
                <a href="signup-professionals-profile-4.html"><img class="act-img" src="images/4-active.png"><img
                    src="images/4.png"> EMPLOYMENT HISTORY</a>
              </li>

              <li>
                <a href="signup-professionals-profile-5.html"><img class="act-img" src="images/5-active.png"><img
                    src="images/5.png"> REFERENCES</a>
              </li>
              <li>
                <a href="signup-professionals-profile-6.html"><img class="act-img" src="images/6-active.png"><img
                    src="images/6.png"> PROFESSIONAL INDEMNITY
                  INSURANCE</a>
              </li>
              <li>
                <a href="signup-professionals-profile-7.html"><img class="act-img" src="images/7-active.png"><img
                    src="images/7.png"> LANGUAGE</a>
              </li>
            </ul>
          </div>

          <div class="col-sm-12 col-lg-9">
            <div class=" dashboard-inner">
              <div class="row">
                <div class="col-sm-12 col-lg-9">
                  <div class="signup-header">
                    <p>START FOR FREE</p>

                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-lg-9">
                  <div class="signup-head">
                    <h3>Employment History</h3>
                  </div>
                </div>
                <div class="col-sm-12 col-lg-3">
                  <div class="page-count">
                    <p> 4 of 6</p>
                  </div>
                </div>
              </div>
              <form action="#" class="form form-section">

                <div class="eductaion-sec">

                  <div class="employment-sec">
                    <p>Add your past work experience</p>
                    <h5>Build your credibility by showcasing the projects or jobs you h</h5>

                    <div class="emp-btn float-left">
                      <a href="#" class="btn add-edu-btn" data-toggle="modal" data-target="#myModal"><i
                          class="fa fa-plus">&nbsp;&nbsp;&nbsp;</i>
                        Add Employment</a>
                    </div>

                  </div>
                </div>


                <div class="row">
                  <div class="col-6 col-sm-6 col-lg-6">
                    <div class="prev-btn float-left">
                      <a href="signup-professionals-profile-3.html" class="btn previous-btn" style="width: 164px;">
                        PREVIOUS</a>
                    </div>
                  </div>

                  <div class="col-6 col-sm-6 col-lg-6">
                    <div class="prev-btn float-right">
                      <a href="signup-professionals-profile-5.html" class="btn btn-next" style="width: 164px;">
                        NEXT</a>
                    </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- Optional JavaScript -->
  <!-- jQuery first, then Popper.js, then Bootstrap JS -->
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
    integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
    integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
    crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
    integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
    crossorigin="anonymous"></script>
  <script>
    $(document).ready(function () {
      $(".sidenav ul li").click(function () {
        $(".sidenav ul li").removeClass("active");
        $(this).addClass("active");
      });
    });
    $(document).ready(function () {
      $(".right-navbar li").click(function () {
        $("right-navbar li").removeClass("active");
        $(this).addClass("active");
      });
    });
  </script>
</body>

</html>