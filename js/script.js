var isValid = true;
var currentSelectionId = 0;
let currentData = [];
let getDataBYid = {};
let page = 1;
let pageLimit = 10;
let paginationContent;
var BaseUrl = new URL(
  "https://65e19ca3a8583365b316d3e2.mockapi.io/api/v1/CRUDDemo"
);
let apiLength;
let pageLinks;

$("#staticBackdrop").click(() => {
  if (!currentSelectionId) {
    $("#addLabel").text("Add Employee");
    $("#submitBtn")
      .removeClass("btn-success")
      .addClass("btn-primary")
      .text("Add");
  }
});

$(".btnClose").click(() => {
  $("#myForm").trigger("reset");
  $("#nameError").text("");
  $("#emailError").text("");
  $("#phoneError").text("");
  $("#genderError").text("");
  $("#enquiryError").text("");
  $("#messageError").text("");
  currentSelectionId = 0;
  getDataBYid = {};
});

$("#myForm").submit((e) => {
  e.preventDefault();

  validateForm();

  if (
    isValid &&
    $("#name").val() !== "" &&
    $("#email").val() !== "" &&
    $("#phone").val() !== "" &&
    $("input[type='radio'][name='gender']:checked").val() !== "" &&
    $("#enquiry :selected").text() !== "" &&
    $("#message").val() !== "" &&
    $("#nameError").text() === "" &&
    $("#emailError").text() === "" &&
    $("#phoneError").text() === "" &&
    $("#genderError").text() === "" &&
    $("#enquiryError").text() === "" &&
    $("#messageError").text() === ""
  ) {
    if (currentSelectionId) {
      updateData();
    } else {
      postData();
    }

    $("#myForm").trigger("reset");
    $("#staticBackdrop").modal("hide");
  } else {
    return false;
  }
});

function getApiLength() {
  $.ajax({
    type: "GET",
    url: "https://65e19ca3a8583365b316d3e2.mockapi.io/api/v1/CRUDDemo",
    dataType: "json",
    beforeSend: function (e) {
      // $("#content").hide();
      $("#loader").show();
    },
    complete: function (e) {
      $("#loader").hide();
      // $("#content").show();
    },
    success: function (response) {
      apiLength = response.length;
    },
    error: function (err) {
      console.log(err);
    },
  });
}

getApiLength();

function pagination() {
  $(".leftPart").html("");
  BaseUrl.searchParams.delete("page");
  BaseUrl.searchParams.delete("limit", pageLimit);

  BaseUrl.searchParams.append("page", page);
  BaseUrl.searchParams.append("limit", pageLimit);

  paginationContent = "";
  paginationContent += `
        <nav aria-label="..." class="float-end">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" href="#"
              >Previous</a
            >
          </li>`;
  //Math.ceil(currentData.length / pageLimit)
  for (let i = 1; i <= Math.ceil(apiLength / pageLimit); i++) {
    paginationContent += `<li class="pageLink page-item" onclick=currentPage(${i}) ><a class="page-link" href="#">${i}</a></li>`;
  }

  paginationContent += `
          <li class="page-item">
            <a class="page-link" href="#">Next</a>
          </li>
          </ul>
          </nav>`;

  $(".leftPart").append(paginationContent);
  pageLinks = document.querySelectorAll(".pageLink");
  if (pageLinks && page === 1) {
    pageLinks[0].classList.add("active");
  } else {
    for (let i = 0; i < pageLinks.length; i++) {
      pageLinks[i].classList.remove("active");
      if (i === page - 1) {
        pageLinks[page - 1].classList.add("active");
      }
    }
  }
  getData();
}

function currentPage(index) {
  page = index;

  pagination();
}

function getData() {
  $.ajax({
    type: "GET",
    url: BaseUrl,
    dataType: "json",
    beforeSend: function (e) {
      // $("#content").hide();
      $("#loader").show();
    },
    complete: function (e) {
      $("#loader").hide();
      // $("#content").show();
    },
    success: function (response) {
      currentData = response;

      $("#tbody").html("");

      let noFound = `<div class="text-center fw-bold fs-5 d-block mt-2 mb-2">No Record Found</div>`;
      if (response && response.length > 0) {
        let data = "";

        response.map((item) => {
          data += `
            <tr>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td>${item.gender}</td>
            <td>${item.enquiry}</td>
            <td>
            ${item.message}
            </td>
            <td>
              <span
                class="d-flex align-items-center gap-2"
              >
                <i class="fa-solid fa-pen" data-bs-toggle="modal"
                data-bs-target="#staticBackdrop" onclick=patchData(${item.id})></i>
                <i class="fa-solid fa-trash" data-bs-toggle="modal"
                data-bs-target="#staticBackdrop2" onclick=removeData(${item.id})></i>
              </span>
            </td>
          </tr>
            `;
        });

        $("#tbody").append(data);
        if (response && response.length > 10) {
          pagination();
        }
      } else {
        $("#tbody").append(noFound);
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
}

getData();

let name;
let email;
let phone;
let gender;
let enquiry;
let message;
function getFormData() {
  return {
    name: $("#name").val(),
    email: $("#email").val(),
    phone: $("#phone").val(),
    gender: $("input[type='radio'][name='gender']:checked").val(),

    enquiry: $("#enquiry option:selected").text(),
    message: $("#message").val(),
  };
}

function postData() {
  let formData = getFormData();
  $.ajax({
    type: "POST",
    url: "https://65e19ca3a8583365b316d3e2.mockapi.io/api/v1/CRUDDemo",
    data: formData,
    dataType: "json",
    beforeSend: function (e) {
      // $("#content").hide();

      $("#loader").show();
    },
    complete: function (e) {
      $("#loader").hide();
      // $("#content").show();
    },
    success: function (response) {
      getData();
    },
    error: function (err) {
      console.error(err.status);
    },
  });
}

function updateData() {
  let formData = getFormData();
  $.ajax({
    type: "PUT",
    url: `https://65e19ca3a8583365b316d3e2.mockapi.io/api/v1/CRUDDemo/${currentSelectionId}`,
    data: formData,
    dataType: "json",
    beforeSend: function (e) {
      // $("#content").hide();

      $("#loader").show();
    },
    complete: function (e) {
      $("#loader").hide();
      // $("#content").show();
    },
    success: function (response) {
      getData();
      currentSelectionId = 0;
      getDataBYid = {};
    },
    error: function (err) {
      console.log(err);
    },
  });
}

function patchData(id) {
  getDataBYid = currentData.find((f) => f.id == id);
  if (getDataBYid) {
    currentSelectionId = getDataBYid.id;
    if (currentSelectionId) {
      $("#addLabel").text("Edit Employee");
      $("#submitBtn")
        .removeClass("btn-primary")
        .addClass("btn-success")
        .text("Save");
    }
    $("#name").val(getDataBYid.name);
    $("#email").val(getDataBYid.email);
    $("#phone").val(getDataBYid.phone);
    $(`input[name='gender'][value='${getDataBYid.gender}']`).prop(
      "checked",
      true
    );
    $("#enquiry").val(getDataBYid.enquiry);
    $("#message").val(getDataBYid.message);
  }
}

function removeData(id) {
  getDataBYid = currentData.find((f) => f.id == id);
  currentSelectionId = id;
  $("#deleteBtn").click(() => {
    deleteRecord(id);
    $("#staticBackdrop2").modal("hide");
  });
}

function deleteRecord(id) {
  $.ajax({
    type: "DELETE",
    url: `https://65e19ca3a8583365b316d3e2.mockapi.io/api/v1/CRUDDemo/${id}`,
    dataType: "json",
    beforeSend: function (e) {
      // $("#content").hide();

      $("#loader").show();
    },
    complete: function (e) {
      $("#loader").hide();
      // $("#content").show();
    },
    success: function (response) {
      getData();
      currentSelectionId = 0;
      getDataBYid = {};
    },
    error: function (err) {
      console.log(err);
    },
  });
}

// -----------------validation Using jquery-------------------
function validateForm() {
  let name = $("#name").val().trim();
  if (name === "") {
    $("#nameError").text("name is required");
    isValid = false;
  }

  let email = $("#email").val().trim();
  if (email === "") {
    $("#emailError").text("email is required");
    isValid = false;
  }

  let phone = $("#phone").val().trim();
  if (phone === "") {
    $("#phoneError").text("phone is required");
    isValid = false;
  }

  let selectedGender = $("input[type='radio'][name='gender']:checked");
  if (!selectedGender.length > 0) {
    $("#genderError").text("gender is required");
    isValid = false;
  }

  let enquiry = $("#enquiry :selected").val();
  if (!enquiry) {
    $("#enquiryError").text("enquiry is required");
    isValid = false;
  }

  let message = $("#message").val().trim();
  if (message === "") {
    $("#messageError").text("message is required");
    isValid = false;
  }
}

$("#myForm").change(function (e) {
  e.preventDefault();

  if ($("input[type='radio']:checked")) {
    $("#genderError").text("");
    isValid = true;
  }
});

$("#name").keyup(function () {
  nameCheck();
  if (isValid) {
    $("#nameError").text("");
  }
});

$("#email").keyup(function () {
  emailCheck();
  if (isValid) {
    $("#emailError").text("");
  }
});

$("#phone").keyup(function () {
  phoneCheck();
  if (isValid) {
    $("#phoneError").text("");
  }
});

$("#gender").keyup(function () {
  //   var checkbox_value = $("#gender:checked").val();
  var checkbox_value = $("input[type='radio'][name='gender']:checked");

  if (!checkbox_value) {
    $("#genderError").text("gender is required");
    isValid = false;
  } else {
    $("#genderError").text("");
    isValid = true;
  }
});

$("select#enquiry").change(function () {
  var selectedEnquiry = $("#enquiry option:selected").text();
  if (!selectedEnquiry) {
    $("#enquiryError").text("enquiry is required");
    isValid = false;
  } else {
    $("#enquiryError").text("");
    isValid = true;
  }
});

$("#message").keyup(function () {
  messageCheck();
  if (isValid) {
    $("#messageError").text("");
  }
});

function nameCheck() {
  let name = $("#name").val().trim();
  if (name === "") {
    $("#nameError").text("name is required");
    isValid = false;
  } else if (!isNaN(name)) {
    $("#nameError").text("please enter valid username");
    isValid = false;
  } else {
    isValid = true;
  }
}

function emailCheck() {
  let email = $("#email").val().trim();
  if (email === "") {
    $("#emailError").text("email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    $("#emailError").text("please enter valid email");
    isValid = false;
  } else {
    isValid = true;
  }
}

function isValidEmail(email) {
  let emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

function phoneCheck() {
  let phone = $("#phone").val().trim();
  if (phone === "") {
    $("#phoneError").text("phone is required");
    isValid = false;
  } else if (isNaN(phone)) {
    $("#phoneError").text("please enter valid phone");
    isValid = false;
  } else {
    isValid = true;
  }
}

function messageCheck() {
  let message = $("#message").val().trim();
  if (message === "") {
    $("#messageError").text("message is required");
    isValid = false;
  } else if (!isNaN(message)) {
    $("#messageError").text("please enter valid message");
    isValid = false;
  } else {
    isValid = true;
  }
}
