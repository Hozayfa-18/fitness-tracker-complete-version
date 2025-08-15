import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserServiceService} from "../service/user-service.service";
import {User} from "../model/user";

@Component({
  selector: 'app-add-profile-picture',
  templateUrl: './add-profile-picture.component.html',
  styleUrl: './add-profile-picture.component.css'
})
export class AddProfilePictureComponent implements OnInit{

  users: User[] = []
  selectedFile: File | null = null;
  retrievedImage: string | null = null;
  base64Data: any;
  retrieveResponse: any;
  message: string = '';
  imageName: string|null = '';
  imageUploaded: boolean = false;
  showImage: boolean = false;

  constructor(private httpClient: HttpClient,private router: Router,private userService: UserServiceService) {}

  ngOnInit() {
    console.log(localStorage.getItem('imageName'))
    if(localStorage.getItem('imageName') !== null){
      this.router.navigate(['/homepage']);
    }
  }

  // Called when the user selects an image
  public onFileChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Called when the user clicks on submit to upload the image
  async onUpload(): Promise<void> {
    if (this.selectedFile) {
      console.log(this.selectedFile);
      const username = localStorage.getItem('username')

      if (!username) {
        this.message = 'Username not found in local storage';
        return;
      }

      const uploadImageData = new FormData();
      uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
      uploadImageData.append('username', username);
      localStorage.setItem('imageName', this.selectedFile.name);

      try {
        const response = await this.userService.updateUserPicture(uploadImageData).toPromise();
        this.message = response.status === 201 ? 'Image uploaded successfully' : 'Image not uploaded successfully';
        this.imageUploaded = response.status === 201;

        await this.delay(1000); // 2-second delay

        const profileResponse = await this.userService.getProfilePicture(username).toPromise();
        this.retrieveResponse = profileResponse;
        this.base64Data = this.retrieveResponse.pic_byte;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      } catch (error) {
        this.message = 'Error uploading or retrieving image';
        console.error(error);
      }
    }

  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  gotologin(){
    this.router.navigate(['/homepage']);
  }

  /*getImage(): void {
    // Make a call to Spring Boot to get the Image Bytes
    const ppName = localStorage.getItem('ppName')
    this.httpClient.get<{ pic_byte: any }>('http://localhost:8080/image/get/' + ppName)
      .subscribe({
        next: (res) => {
          this.retrieveResponse = res;
          this.base64Data = this.retrieveResponse.pic_byte;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        },
        error: () => {
          this.message = 'Error retrieving image';
        }
      });
  }*/
}
