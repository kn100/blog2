# Compatibility shim — allows `nix-shell` to still work by delegating to the flake.
(builtins.getFlake (toString ./.)).devShells.${builtins.currentSystem}.default
