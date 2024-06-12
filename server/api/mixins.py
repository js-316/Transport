from django.contrib.auth.mixins import UserPassesTestMixin

class PermissionMixin(UserPassesTestMixin):
    def test_func(self):
        user = self.request.user
        permissions = [permission for group in user.groups.all() for permission in group.permissions.all()]
        print(f"Checking permissions: {permissions}")
        return any(permission in permissions for permission in self.required_permissions)