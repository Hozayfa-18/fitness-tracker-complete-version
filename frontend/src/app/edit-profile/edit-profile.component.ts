import {Component, OnInit, Output, EventEmitter } from '@angular/core';
import {EditProfileService} from "../service/edit-profile.service";
import {User} from "../model/user";
import {UserServiceService} from "../service/user-service.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit{
  isOpen: boolean = false;
  users: User[] = [];
  username: string = '';
  firstName: string = '';
  lastName: string = '';
  height: string = ''
  weight: string = ''
  gender: string = '';

  @Output() profileUpdated = new EventEmitter<any>();

  constructor(private editProfileService: EditProfileService, private userService:UserServiceService) { }

  ngOnInit(): void {
    const username = localStorage.getItem('username')
    this.userService.findByUsername(username).subscribe(
      (data) =>{
        this.users = [data]
        if(data && data.firstName && data.lastName && data.role){
          localStorage.setItem('firstname', data.firstName)
          localStorage.setItem('lastname',data.lastName)
          localStorage.setItem('role',data.role)
          if(data.role && data.role==='user' && data.height && data.weight && data.gender){
            localStorage.setItem('height', data.height.toString())
            localStorage.setItem('weight', data.weight.toString())
            localStorage.setItem('gender', data.gender)
          }
        }
      }
    )

    this.userService.isOpen$.subscribe(status => {
      this.isOpen = status;
    });

  }

  closeModal(): void {
    this.userService.close();
  }

  async onSubmit(): Promise<void> {
    const oldUsername = localStorage.getItem('username')
    const oldFirstname = localStorage.getItem('firstname')
    const oldLastname = localStorage.getItem('lastname')
    const role = localStorage.getItem('role')
    let oldHeight:string|null = '' || null
    let oldWeight:string|null = '' || null
    let oldGender:string|null = '' || null
    if(role === 'user'){
      oldHeight = localStorage.getItem('height')
      oldWeight = localStorage.getItem('weight')
      oldGender = localStorage.getItem('gender')
    }

    if (!oldUsername||!oldFirstname||!oldLastname) {
      return;
    }
    if(role === 'user'){
      if(!oldHeight||!oldWeight||!oldGender){
        return
      }
    }

    const UserProfileData = new FormData()
    UserProfileData.append('oldUsername',oldUsername)
    if(!this.firstName){
      UserProfileData.append('newFirstName',oldFirstname)
    }else{
      UserProfileData.append('newFirstName',this.firstName)
    }
    if(!this.lastName){
      UserProfileData.append('newLastName',oldLastname)
    }else {
      UserProfileData.append('newLastName',this.lastName)
    }
    if(role === 'user'){
      if(!this.height && oldHeight){
        UserProfileData.append('newHeight',oldHeight)
      }
      else{
        UserProfileData.append('newHeight',this.height)
      }
      if(!this.weight && oldWeight){
        UserProfileData.append('newWeight',oldWeight)
      }else{
        UserProfileData.append('newWeight',this.weight)
      }
      if(!this.gender && oldGender){
        UserProfileData.append('newGender',oldGender)
      }else{
        UserProfileData.append('newGender',this.gender)
      }
    }

    localStorage.removeItem('firstname')
    localStorage.removeItem('lastname')
    localStorage.removeItem('height')
    localStorage.removeItem('weight')
    localStorage.removeItem('gender')
    localStorage.removeItem('role')


    try{
      const response = await this.userService.updateUserProfile(UserProfileData).toPromise()
      console.log(response)
    }catch(error){
      console.log(error)

    }
    window.location.reload()
  }

}
