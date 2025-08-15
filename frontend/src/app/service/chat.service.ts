import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import {Message} from "../model/message";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private url = 'http://localhost:8080/messages';

  constructor(private http: HttpClient) {}

  getMessages(sender: string, receiver: string): Observable<any> {
    return this.http.get<any[]>(`${this.url}/private?sender=${sender}&receiver=${receiver}`);
  }

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.url, message);
  }

  editMessage(id: number, content: string): Observable<void> {
    console.log(`${this.url}/editMessage?id=${id}`)
    return this.http.put<void>(`${this.url}/editMessage?id=${id}`, { content });
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/deleteMessage?id=${id}`);
  }

  getGroupMessages(groupId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.url}/group?groupId=${groupId}`);
  }

  createGroup(name: string, members: string[]): Observable<{ name: string; id: number }> {
    return this.http.post<{ name: string; id: number }>(`${this.url}/createGroup`, { name, members });
  }
  getUserGroups(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/userGroups?username=${username}`);
  }
  updateIsRead(senderUsername:string, receiverUsername:string){
    return this.http.put<void>(`${this.url}/updateIsRead?senderUsername=${senderUsername}&receiverUsername=${receiverUsername}`,null,{ observe: 'response' })
  }

  updateActiveChat(username: string, chatWith: string | null): Observable<void> {
    return this.http.put<void>(`${this.url}/updateActiveChat?username=${username}&chatWith=${chatWith}`, null);
  }

  updateGroupIsRead(senderUsername:string, groupId:number){
    return this.http.put<void>(`${this.url}/updateGroupIsRead?senderUsername=${senderUsername}&groupId=${groupId}`,null,{ observe: 'response' })
  }

  updateActiveGroupChat(username: string, group_id: number): Observable<void> {
    return this.http.put<void>(`${this.url}/updateActiveGroupChat?username=${username}&group_id=${group_id}`, null);
  }
}
