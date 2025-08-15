import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ChatService} from "../service/chat.service";
import {Message} from "../model/message";
import {interval, Subscription} from "rxjs";
import {UserServiceService} from "../service/user-service.service";
import {User} from "../model/user";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewChecked, OnInit, OnDestroy{

  @ViewChild('messagesContainer') messagesContainer?: ElementRef;

  @HostListener('document:click')
  onDocumentClick(): void {
    this.contextMenuVisible = false;
  }

  messages: Message[] = [];
  messageText: string = '';
  username = localStorage.getItem('username')
  currentUser = this.username;
  chatWith = '';
  isRead:boolean = false;
  availableRecipients: User[] = []
  private autoScrollEnabled = true;

  groups: { name: string, id: number }[] = [];
  currentGroupId: number | null = null;
  isCreatingGroup = false;
  newGroupName = '';
  selectedGroupMembers: string[] = [];

  private singleChatPolling?: Subscription;
  private groupChatPolling?: Subscription;

  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  contextMenuMessageIndex: number | null = null;

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef, private userService: UserServiceService) {}

  ngOnInit(): void {
    this.loadFriends()

    this.loadMessages();
    this.loadGroups();

    this.stopSinglePolling();
    this.stopGroupPolling();
  }

  ngOnDestroy(): void {
    console.log('ChatComponent destroyed, stopping subscriptions');
    this.stopSinglePolling();
    this.stopGroupPolling();
  }

  loadFriends(): void {
    const username = localStorage.getItem('username')
    this.userService.getFriends(username!).subscribe(
      (data) =>{
        this.availableRecipients = data
      }
    )
  }

  loadMessages(): void {
    const username = localStorage.getItem('username')
    if(!username) return
    this.chatService.getMessages(username, this.chatWith).subscribe((data: any[]) => {
      const oldCount = this.messages.length;
      this.messages = data;
      const newCount = this.messages.length;

      // If new messages arrived AND user is currently at bottom, auto-scroll
      if (newCount > oldCount) {
        //const lastMessage = this.messages[this.messages.length - 1];
        // If last message is from someone else and user is at bottom, scroll down
        //if (lastMessage && lastMessage.sender !== this.currentUser) {
          this.autoScrollEnabled = true;
        //}
      }
    });
  }

  loadGroupMessages(groupId: number): void {
    this.chatService.getGroupMessages(groupId).subscribe((data: Message[]) => {
      const oldCount = this.messages.length;
      this.messages = data;
      const newCount = this.messages.length;

      // If new messages arrived AND user is currently at bottom, auto-scroll
      if (newCount > oldCount) {
        //const lastMessage = this.messages[this.messages.length - 1];
        //if (lastMessage && lastMessage.sender !== this.currentUser) {
          this.autoScrollEnabled = true;
        //}
      }
    });
  }

  loadGroups(): void {
    const username = localStorage.getItem('username');
    if (!username) {
      console.error('No logged-in user found');
      return;
    }

    this.chatService.getUserGroups(username).subscribe(
      (groups) => {
        this.groups = groups;
        console.log('Loaded groups:', this.groups);
      },
      (error) => {
        console.error('Failed to load groups:', error);
      }
    );
  }

  ngAfterViewChecked(): void {
    if (this.autoScrollEnabled) {
      this.scrollToBottom();
      this.autoScrollEnabled = false;
    }
  }

  sendMessage(): void {
    const username = localStorage.getItem('username');
    if (!username) return;

    if (!this.chatWith ) {
      console.error('Cannot send a message without selecting a recipient');
      return;
    }

    if (this.messageText.trim()) {
      const newMessage = new Message(
        username,
        this.chatWith || '',
        this.messageText.trim(),
        new Date(),
        false,
      );

      //newMessage.groupId = this.currentGroupId || undefined; // Assign groupId if it's a group message
      this.messages.push(newMessage);
      this.messageText = '';

      this.autoScrollEnabled = true;

      this.chatService.sendMessage(newMessage).subscribe(() => {
        this.loadMessages();
      });
    }
  }

  sendGroupMessage(): void {
    const username = localStorage.getItem('username')
    if(!username) return
    if (this.messageText.trim() && this.currentGroupId) {
      const newMessage = new Message(
        username,
        '', // No direct receiver
        this.messageText.trim(),
        new Date(),
        false
      );
      newMessage.groupId = this.currentGroupId;
      this.messages.push(newMessage);
      this.messageText = '';

      this.autoScrollEnabled = true;

      this.chatService.sendMessage(newMessage).subscribe(() => this.loadGroupMessages(this.currentGroupId!));
    }

  }


  // Open group creation modal
  openGroupCreation(): void {
    this.isCreatingGroup = true;
  }

// Close group creation modal
  closeGroupCreation(): void {
    this.isCreatingGroup = false;
    this.newGroupName = '';
    this.selectedGroupMembers = [];
  }

// Create a new group
  createGroup(): void {
    console.log('Create Group triggered');

    if (!this.newGroupName.trim() || this.selectedGroupMembers.length === 0) {
      alert('Please provide a group name and select at least one member.');
      return;
    }

    // Add the current user automatically to the group (if not already added)
    if (!this.selectedGroupMembers.includes(this.username!)) {
      this.selectedGroupMembers.push(this.username!);
    }

    console.log('Group Name:', this.newGroupName);
    console.log('Selected Members (including you):', this.selectedGroupMembers);

    this.chatService.createGroup(this.newGroupName.trim(), this.selectedGroupMembers).subscribe(
      (group) => {
        console.log('Group created successfully:', group);
        this.groups.push(group);
        //this.cdr.detectChanges();
        this.closeGroupCreation();
      },
      (error) => {
        console.error('Error creating group:', error);
      }
    );
  }


  isMemberSelected(user: string): boolean {
    return this.selectedGroupMembers.includes(user);
  }

  toggleMemberSelection(user: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      if (!this.selectedGroupMembers.includes(user)) {
        this.selectedGroupMembers.push(user);
      }
    } else {
      this.selectedGroupMembers = this.selectedGroupMembers.filter(
        (member) => member !== user
      );
    }

    console.log('Selected Members:', this.selectedGroupMembers);
  }


  onChatWithChange() {
    console.log('Chatting with:', this.chatWith);
    setTimeout(() => {
      this.autoScrollEnabled = true;
    }, 100);
  }

  private scrollToBottom(): void {
    if (!this.messagesContainer) {
      //console.warn('messagesContainer is undefined, skipping scrollToBottom');
      return;
    }
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
      //console.log('Auto-scrolling to:', container.scrollHeight);
    } catch (err) {
      //console.error('Scroll error:', err);
    }
  }

  updateActiveChat(chatWith: string | null): void {
    this.chatService.updateActiveChat(this.username!, chatWith).subscribe();
  }

  selectRecipient(user: string): void {
    this.updateActiveChat(user);
    this.stopGroupPolling(); // Stop group polling
    this.chatWith = user;
    this.currentGroupId = null;
    this.messages = [];
    this.loadMessages();
    this.autoScrollEnabled = true;
    this.startSinglePolling();
    //this.onChatWithChange();
    this.isRead = false

    console.log('Updating read status:', this.username, this.chatWith);
    this.chatService.updateIsRead(this.chatWith, this.username!).subscribe();

    setTimeout(() => {
      this.scrollToBottom();
    }, 50);
  }

  selectGroup(groupId: number): void {
    this.stopSinglePolling();
    this.currentGroupId = groupId;
    this.chatWith = '';
    this.messages = [];
    this.loadGroupMessages(groupId);
    this.autoScrollEnabled = true;

    this.startGroupPolling();
    console.log(`Group ${groupId} selected`);
    this.isRead = false

    console.log('Updating read status:', this.username, this.chatWith);
    this.chatService.updateGroupIsRead(this.username!,groupId).subscribe();

    setTimeout(() => {
      this.scrollToBottom();
    }, 50);
  }

  startSinglePolling(): void {
    if (this.singleChatPolling) {
      this.singleChatPolling.unsubscribe();
    }
    this.singleChatPolling = interval(100).subscribe(() => {
      this.loadMessages();

      console.log(this.chatWith)
      if (this.chatWith) {
        console.log(`Updating read status for messages with ${this.chatWith}`);
        this.chatService.updateIsRead(this.chatWith,this.username!).subscribe(
          () => console.log('Read status updated during polling'),
          error => console.error('Failed to update read status during polling:', error)
        );
      }
    });
  }

  stopSinglePolling(): void {
    if (this.singleChatPolling) {
      this.singleChatPolling.unsubscribe();
      this.singleChatPolling = undefined;
    }
  }

  startGroupPolling(): void {
    if (this.groupChatPolling) {
      this.groupChatPolling.unsubscribe();
    }
    if (this.currentGroupId !== null) {
      this.groupChatPolling = interval(100).subscribe(() => {
        this.loadGroupMessages(this.currentGroupId!);
        //this.autoScrollEnabled = true;
        this.chatService.updateGroupIsRead(this.username!, this.currentGroupId!).subscribe();

      });
    }
  }

  stopGroupPolling(): void {
    if (this.groupChatPolling) {
      this.groupChatPolling.unsubscribe();
      this.groupChatPolling = undefined;
    }
  }

  getGroupName(groupId: number | null): string | null {
    if (groupId === null) {
      return null;
    }
    const group = this.groups.find(g => g.id === groupId);
    return group ? group.name : null;
  }

  onRightClick(event: MouseEvent, messageIndex: number): void {
    console.log(messageIndex);
    event.preventDefault(); // Prevent the default context menu
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuMessageIndex = messageIndex;
  }

  editMessage(index: number | null): void {
    console.log(index);
    if (index === null) return;

    const message = this.messages[index];
    const newContent = prompt('Edit your message:', message.content);
    console.log(message.id)
    if (newContent !== null && newContent.trim() !== '' && message.id) {
      message.content = newContent.trim();

      this.chatService.editMessage(message.id, message.content).subscribe(() => {
        console.log('Message updated:', message);
      });
    }
    this.contextMenuVisible = false;
  }

  deleteMessage(index: number | null): void {
    if (index === null) return;

    const message = this.messages[index];
    if (confirm('Are you sure you want to delete this message?') && message.id) {
      this.chatService.deleteMessage(message.id).subscribe(() => {
        console.log('Message deleted:', message);
        this.messages.splice(index, 1);
      });
    }
    this.contextMenuVisible = false;
  }

}
