use std::ptr;
use winapi::um::{winuser, libloaderapi};

// Define a callback function to handle mouse events
pub unsafe extern "system" fn mouse_hook_callback(code: i32, w_param: usize, l_param: isize) -> isize {
    if code >= 0 && w_param as u32 == winuser::WM_LBUTTONDOWN {
        // Left mouse button clicked
        println!("Left mouse button clicked");
    }
    // Call the next hook in the chain
    winuser::CallNextHookEx(ptr::null_mut(), code, w_param, l_param)
}

fn main() {
    // Load the User32 library
    let user32 = unsafe { libloaderapi::LoadLibraryA(b"user32.dll\0".as_ptr() as *const i8) };
    
    // Set up a mouse hook
    let hook = unsafe { 
        winuser::SetWindowsHookExA(winuser::WH_MOUSE_LL, Some(mouse_hook_callback), user32, 0)
    };

    // Enter the message loop to handle mouse events
    let mut msg = winuser::MSG {
        hwnd: ptr::null_mut(),
        message: 0,
        wParam: 0,
        lParam: 0,
        time: 0,
        pt: winuser::POINT { x: 0, y: 0 },
    };
    loop {
        unsafe {
            if winuser::GetMessageW(&mut msg, ptr::null_mut(), 0, 0) > 0 {
                winuser::TranslateMessage(&msg);
                winuser::DispatchMessageW(&msg);
            } else {
                break;
            }
        }
    }

    // Clean up the mouse hook before exiting
    unsafe { winuser::UnhookWindowsHookEx(hook) };
}
